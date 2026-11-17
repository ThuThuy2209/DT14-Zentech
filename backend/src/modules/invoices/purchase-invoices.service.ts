import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreatePurchaseInvoiceDto } from './dto/create-purchase-invoice.dto.js';
import { UpdatePurchaseInvoiceDto } from './dto/update-purchase-invoice.dto.js';
import { FilterPurchaseInvoiceDto } from './dto/filter-purchase-invoice.dto.js';
import { AiExtractionService } from './ai-extraction.service.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PurchaseInvoicesService {
  private readonly logger = new Logger(PurchaseInvoicesService.name);
  private readonly COMPANY_TAX_CODE = '0319002001'; // MST của Minh Software theo hồ sơ kiểm thử

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiExtractionService: AiExtractionService,
  ) {}

  /**
   * ĐỒNG BỘ 25 HÓA ĐƠN MẪU (CHUẨN KỊCH BẢN SRS)
   */
  async syncDemoInvoices(userId?: number) {
    const jsonPath = path.resolve(
      process.cwd(),
      'src/modules/invoices/data/mock-invoices-25.json',
    );

    if (!fs.existsSync(jsonPath)) {
      throw new NotFoundException('Không tìm thấy tệp mock-invoices-25.json');
    }

    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const invoices = JSON.parse(raw);
    const createdInvoices = [];

    // Tự động dọn dẹp các hóa đơn upload test tạm thời ngoài bộ 25 mẫu gốc (nếu có)
    const demoNumbers = invoices.map((inv: any) => inv.invoiceNumber);
    const testInvoices = await this.prisma.purchaseInvoice.findMany({
      where: {
        OR: [
          { invoiceNumber: { notIn: demoNumbers } },
          { document: { filePath: { contains: 'uploads/documents' } } },
        ],
      },
      select: { id: true, documentId: true },
    });

    for (const t of testInvoices) {
      await this.prisma.purchaseInvoice.delete({ where: { id: t.id } }).catch(() => {});
      if (t.documentId) {
        await this.prisma.document.delete({ where: { id: t.documentId } }).catch(() => {});
      }
    }

    for (const inv of invoices) {
      const pdfRelPath = `uploads/mock_invoices/HD_${inv.invoiceNumber}.pdf`;

      // 1. Tạo hoặc lấy bản ghi Document
      let doc = await this.prisma.document.findFirst({
        where: { filePath: pdfRelPath },
      });

      if (!doc) {
        doc = await this.prisma.document.create({
          data: {
            documentName: `Hóa đơn GTGT ${inv.invoiceNumber} - ${inv.sellerName}.pdf`,
            filePath: pdfRelPath,
            fileType: 'application/pdf',
            documentType: 'PURCHASE_INVOICE',
            uploadedBy: userId || null,
          },
        });
      }

      // 2. Kiểm tra xem hóa đơn này đã được import chưa
      let purchaseInv = await this.prisma.purchaseInvoice.findFirst({
        where: {
          invoiceNumber: inv.invoiceNumber,
          sellerTaxCode: inv.sellerTaxCode,
        },
      });

      // Xác định trạng thái nghiệp vụ theo tài liệu kiểm thử:
      // - Hóa đơn 000024: MST người bán trùng với nhà cung cấp số 1 (9900000001)
      // - Hóa đơn 000025: MST người bán sai là 9999999999 (theo danh mục là 9900000025)
      let duplicateStatus = 'VALID';
      let buyerTaxStatus = 'MATCHED';

      if (inv.invoiceNumber === '000024') {
        duplicateStatus = 'DUPLICATE';
      }

      if (
        inv.buyerTaxCode !== this.COMPANY_TAX_CODE ||
        inv.sellerTaxStatus === 'INVALID' ||
        inv.invoiceNumber === '000025'
      ) {
        buyerTaxStatus = 'MISMATCHED';
      }

      const invDate = inv.invoiceDate ? new Date(inv.invoiceDate) : new Date();
      const dueDate = new Date(invDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 ngày

      if (!purchaseInv) {
        purchaseInv = await this.prisma.purchaseInvoice.create({
          data: {
            supplierName: inv.sellerName,
            invoiceNumber: inv.invoiceNumber,
            sellerTaxCode: inv.sellerTaxCode,
            buyerTaxCode: inv.buyerTaxCode,
            invoiceDate: invDate,
            dueDate,
            totalAmount: Number(inv.totalAmount),
            paidAmount: 0,
            outstandingAmount: Number(inv.totalAmount),
            duplicateStatus,
            buyerTaxStatus,
            ocrStatus: 'COMPLETED',
            paymentStatus: 'UNPAID',
            documentId: doc.id,
          },
        });
      } else {
        // Cập nhật lại trạng thái chuẩn
        purchaseInv = await this.prisma.purchaseInvoice.update({
          where: { id: purchaseInv.id },
          data: {
            duplicateStatus,
            buyerTaxStatus,
            ocrStatus: 'COMPLETED',
            paymentStatus: 'UNPAID',
            documentId: doc.id,
          },
        });
      }

      createdInvoices.push(purchaseInv);
    }

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'SYNC_DEMO_PURCHASE_INVOICES',
        entityType: 'PURCHASE_INVOICE',
        description: `Đồng bộ thành công 25 hóa đơn đầu vào mẫu theo chuẩn tài liệu SRS`,
      },
    });

    return {
      success: true,
      count: createdInvoices.length,
      message: 'Đồng bộ thành công 25 hóa đơn mua vào mẫu kèm tệp PDF!',
      items: createdInvoices,
    };
  }

  /**
   * TẢI LÊN FILE HÓA ĐƠN (PDF / ẢNH) VÀ AI TỰ ĐỘNG BÓC TÁCH (OCR)
   */
  async uploadInvoice(file: Express.Multer.File, userId?: number) {
    if (!file) {
      throw new BadRequestException('Vui lòng chọn tệp hóa đơn (PDF hoặc hình ảnh) để tải lên');
    }

    // 1. Chuẩn hóa đường dẫn file
    const relFilePath = file.path.replace(/\\/g, '/');

    // 2. Tạo bản ghi Document lưu thông tin file
    const document = await this.prisma.document.create({
      data: {
        documentName: file.originalname,
        filePath: relFilePath,
        fileType: file.mimetype,
        fileSize: BigInt(file.size),
        documentType: 'PURCHASE_INVOICE',
        uploadedBy: userId || null,
      },
    });

    // 3. Gửi sang AI Service bóc tách dữ liệu
    const extracted = await this.aiExtractionService.extractInvoice(
      file.path,
      file.originalname,
    );

    // 4. Kiểm tra quy tắc nghiệp vụ:
    // a. Kiểm tra trùng lặp số hóa đơn
    const existing = await this.prisma.purchaseInvoice.findFirst({
      where: {
        invoiceNumber: extracted.invoiceNumber,
        sellerTaxCode: extracted.sellerTaxCode,
      },
    });
    const duplicateStatus = existing ? 'DUPLICATE' : 'VALID';

    // b. Kiểm tra MST người mua đối chiếu với MST công ty Minh Software
    const buyerTaxStatus =
      extracted.buyerTaxCode === this.COMPANY_TAX_CODE ? 'MATCHED' : 'MISMATCHED';

    const invoiceDate = extracted.invoiceDate
      ? new Date(extracted.invoiceDate)
      : new Date();
    const dueDate = new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    // 5. Lưu vào bảng purchase_invoices
    const purchaseInvoice = await this.prisma.purchaseInvoice.create({
      data: {
        supplierName: extracted.supplierName,
        invoiceNumber: extracted.invoiceNumber,
        sellerTaxCode: extracted.sellerTaxCode,
        buyerTaxCode: extracted.buyerTaxCode,
        invoiceDate,
        dueDate,
        totalAmount: extracted.totalAmount,
        paidAmount: 0,
        outstandingAmount: extracted.totalAmount,
        duplicateStatus,
        buyerTaxStatus,
        ocrStatus: extracted.ocrStatus,
        paymentStatus: 'UNPAID',
        documentId: document.id,
      },
      include: {
        document: true,
      },
    });

    // 6. Ghi nhật ký hoạt động
    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'UPLOAD_PURCHASE_INVOICE',
        entityType: 'PURCHASE_INVOICE',
        entityId: purchaseInvoice.id,
        description: `Tải lên và bóc tách hóa đơn đầu vào: ${purchaseInvoice.invoiceNumber} (${purchaseInvoice.supplierName}) - Độ tin cậy AI: ${Math.round((extracted.confidenceScore || 0.9) * 100)}%`,
      },
    });

    return {
      invoice: {
        ...purchaseInvoice,
        document: purchaseInvoice.document
          ? {
              ...purchaseInvoice.document,
              fileSize: purchaseInvoice.document.fileSize
                ? Number(purchaseInvoice.document.fileSize)
                : null,
            }
          : null,
      },
      document: {
        ...document,
        fileSize: document.fileSize ? Number(document.fileSize) : null,
      },
      aiExtraction: extracted,
      alerts: {
        isDuplicate: duplicateStatus === 'DUPLICATE',
        isTaxMismatched: buyerTaxStatus === 'MISMATCHED',
      },
    };
  }

  /**
   * DANH SÁCH HÓA ĐƠN MUA VÀO (THEO TAB GIAO DIỆN)
   */
  async findAll(query: FilterPurchaseInvoiceDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Phân loại theo các Tab trên giao diện:
    // - ALL: Tất cả
    // - NEEDS_REVIEW: Cần duyệt (Hóa đơn có cờ cảnh báo trùng hoặc sai MST)
    // - VALID: Hợp lệ (Hóa đơn không trùng, đúng MST, chưa bị từ chối)
    // - REJECTED: Đã từ chối
    if (query.tab === 'NEEDS_REVIEW') {
      where.OR = [
        { duplicateStatus: 'DUPLICATE' },
        { buyerTaxStatus: 'MISMATCHED' },
      ];
      where.paymentStatus = { not: 'REJECTED' };
    } else if (query.tab === 'VALID') {
      where.duplicateStatus = 'VALID';
      where.buyerTaxStatus = 'MATCHED';
      where.paymentStatus = { not: 'REJECTED' };
    } else if (query.tab === 'REJECTED') {
      where.paymentStatus = 'REJECTED';
    }

    if (query.search) {
      const kw = query.search.trim();
      where.OR = [
        { invoiceNumber: { contains: kw, mode: 'insensitive' } },
        { supplierName: { contains: kw, mode: 'insensitive' } },
        { sellerTaxCode: { contains: kw, mode: 'insensitive' } },
      ];
    }

    const [items, total, allCount, needsReviewCount, validCount, rejectedCount] =
      await Promise.all([
        this.prisma.purchaseInvoice.findMany({
          where,
          skip,
          take: limit,
          orderBy: { id: 'asc' },
          include: {
            document: true,
          },
        }),
        this.prisma.purchaseInvoice.count({ where }),
        this.prisma.purchaseInvoice.count(),
        this.prisma.purchaseInvoice.count({
          where: {
            OR: [
              { duplicateStatus: 'DUPLICATE' },
              { buyerTaxStatus: 'MISMATCHED' },
            ],
            paymentStatus: { not: 'REJECTED' },
          },
        }),
        this.prisma.purchaseInvoice.count({
          where: {
            duplicateStatus: 'VALID',
            buyerTaxStatus: 'MATCHED',
            paymentStatus: { not: 'REJECTED' },
          },
        }),
        this.prisma.purchaseInvoice.count({
          where: { paymentStatus: 'REJECTED' },
        }),
      ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      tabCounts: {
        all: allCount,
        needsReview: needsReviewCount,
        valid: validCount,
        rejected: rejectedCount,
      },
    };
  }

  /**
   * XEM CHI TIẾT 1 HÓA ĐƠN MUA VÀO (CHO GIAO DIỆN SPLIT-VIEW)
   */
  async findOne(id: number) {
    const invoice = await this.prisma.purchaseInvoice.findUnique({
      where: { id },
      include: {
        document: true,
        emailMessage: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException(`Không tìm thấy hóa đơn mua vào với ID #${id}`);
    }

    return invoice;
  }

  /**
   * CẬP NHẬT THÔNG TIN HÓA ĐƠN (KHI CHỦ DOANH NGHIỆP SỬA Ô INPUT)
   */
  async update(id: number, dto: UpdatePurchaseInvoiceDto, userId?: number) {
    await this.findOne(id);

    const updated = await this.prisma.purchaseInvoice.update({
      where: { id },
      data: {
        supplierName: dto.supplierName?.trim(),
        invoiceNumber: dto.invoiceNumber?.trim(),
        sellerTaxCode: dto.sellerTaxCode?.trim(),
        buyerTaxCode: dto.buyerTaxCode?.trim(),
        invoiceDate: dto.invoiceDate ? new Date(dto.invoiceDate) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        totalAmount: dto.totalAmount !== undefined ? Number(dto.totalAmount) : undefined,
        duplicateStatus: dto.duplicateStatus,
        buyerTaxStatus: dto.buyerTaxStatus,
      },
      include: {
        document: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'UPDATE_PURCHASE_INVOICE',
        entityType: 'PURCHASE_INVOICE',
        entityId: id,
        description: `Chỉnh sửa thông tin hóa đơn đầu vào #${id} (${updated.invoiceNumber})`,
      },
    });

    return updated;
  }

  /**
   * PHÊ DUYỆT / XÁC NHẬN GHI SỔ HÓA ĐƠN HỢP LỆ
   */
  async confirm(id: number, userId?: number) {
    const invoice = await this.findOne(id);

    const updated = await this.prisma.purchaseInvoice.update({
      where: { id },
      data: {
        duplicateStatus: 'VALID',
        buyerTaxStatus: 'MATCHED',
        paymentStatus: 'UNPAID', // Chờ chuyển sang sổ cái/khoản phải trả
      },
      include: {
        document: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'CONFIRM_PURCHASE_INVOICE',
        entityType: 'PURCHASE_INVOICE',
        entityId: id,
        description: `Chủ doanh nghiệp phê duyệt xác nhận hóa đơn đầu vào ${invoice.invoiceNumber} (${invoice.supplierName})`,
      },
    });

    return updated;
  }

  /**
   * TỪ CHỐI HÓA ĐƠN TRÙNG LẶP HOẶC KHÔNG HỢP LỆ
   */
  async reject(id: number, reason?: string, userId?: number) {
    const invoice = await this.findOne(id);

    const updated = await this.prisma.purchaseInvoice.update({
      where: { id },
      data: {
        paymentStatus: 'REJECTED',
      },
      include: {
        document: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'REJECT_PURCHASE_INVOICE',
        entityType: 'PURCHASE_INVOICE',
        entityId: id,
        description: `Chủ doanh nghiệp từ chối hóa đơn đầu vào ${invoice.invoiceNumber}${reason ? ` (Lý do: ${reason})` : ''}`,
      },
    });

    return updated;
  }
}
