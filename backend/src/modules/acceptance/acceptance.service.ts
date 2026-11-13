import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAcceptanceDto } from './dto/create-acceptance.dto.js';
import { UpdateAcceptanceDto } from './dto/update-acceptance.dto.js';
import { FilterAcceptanceDto } from './dto/filter-acceptance.dto.js';
import { AttachEvidenceDto } from './dto/attach-evidence.dto.js';

@Injectable()
export class AcceptanceService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * TẠO HỒ SƠ NGHIỆM THU
   */
  async create(dto: CreateAcceptanceDto, userId?: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: dto.contractId },
    });
    if (!contract) {
      throw new NotFoundException(`Không tìm thấy hợp đồng với ID #${dto.contractId}`);
    }

    if (dto.evidenceDocumentId) {
      const doc = await this.prisma.document.findUnique({
        where: { id: dto.evidenceDocumentId },
      });
      if (!doc) {
        throw new NotFoundException(`Không tìm thấy tài liệu minh chứng với ID #${dto.evidenceDocumentId}`);
      }
    }

    // Tự sinh mã nghiệm thu: NT-YYYYMM-XXXX
    let acceptanceCode = dto.acceptanceCode?.trim();
    if (!acceptanceCode) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const count = await this.prisma.acceptanceRecord.count({
        where: { acceptanceCode: { startsWith: `NT-${yearMonth}` } },
      });
      acceptanceCode = `NT-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
    }

    const acceptance = await this.prisma.acceptanceRecord.create({
      data: {
        contractId: dto.contractId,
        acceptanceCode,
        acceptanceDate: dto.acceptanceDate ? new Date(dto.acceptanceDate) : new Date(),
        content: dto.content.trim(),
        result: dto.result,
        issues: dto.issues?.trim() || null,
        evidenceDocumentId: dto.evidenceDocumentId || null,
      },
      include: {
        contract: {
          select: {
            id: true,
            contractCode: true,
            contractName: true,
            contractValue: true,
          },
        },
        evidenceDocument: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'CREATE_ACCEPTANCE_RECORD',
        entityType: 'CONTRACT',
        entityId: dto.contractId,
        description: `Tạo hồ sơ nghiệm thu ${acceptance.acceptanceCode} cho hợp đồng ${contract.contractCode} (Kết quả: ${acceptance.result})`,
      },
    });

    return acceptance;
  }

  /**
   * LẤY DANH SÁCH TẤT CẢ HỒ SƠ NGHIỆM THU (Phân trang, tìm kiếm, lọc)
   */
  async findAll(query: FilterAcceptanceDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.contractId) {
      where.contractId = Number(query.contractId);
    }
    if (query.result) {
      where.result = query.result;
    }
    if (query.search) {
      const kw = query.search.trim();
      where.OR = [
        { acceptanceCode: { contains: kw, mode: 'insensitive' } },
        { content: { contains: kw, mode: 'insensitive' } },
        { issues: { contains: kw, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.acceptanceRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          contract: {
            select: {
              id: true,
              contractCode: true,
              contractName: true,
              contractValue: true,
              status: true,
              customer: {
                select: {
                  id: true,
                  customerName: true,
                  companyName: true,
                },
              },
            },
          },
          evidenceDocument: true,
          salesInvoices: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true,
              invoiceStatus: true,
              paymentStatus: true,
            },
          },
        },
      }),
      this.prisma.acceptanceRecord.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * XEM CHI TIẾT 1 HỒ SƠ NGHIỆM THU
   */
  async findOne(id: number) {
    const acceptance = await this.prisma.acceptanceRecord.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            customer: true,
          },
        },
        evidenceDocument: true,
        salesInvoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            invoiceStatus: true,
            paymentStatus: true,
            invoiceDate: true,
          },
        },
      },
    });

    if (!acceptance) {
      throw new NotFoundException(`Không tìm thấy hồ sơ nghiệm thu với ID #${id}`);
    }

    return acceptance;
  }

  /**
   * LẤY DANH SÁCH NGHIỆM THU THEO HỢP ĐỒNG
   */
  async findByContract(contractId: number) {
    return this.prisma.acceptanceRecord.findMany({
      where: { contractId },
      orderBy: { id: 'desc' },
      include: {
        evidenceDocument: true,
        salesInvoices: {
          select: {
            id: true,
            invoiceNumber: true,
            totalAmount: true,
            invoiceStatus: true,
            paymentStatus: true,
          },
        },
      },
    });
  }

  /**
   * CẬP NHẬT HỒ SƠ NGHIỆM THU
   */
  async update(id: number, dto: UpdateAcceptanceDto, userId?: number) {
    const existing = await this.findOne(id);

    if (dto.evidenceDocumentId) {
      const doc = await this.prisma.document.findUnique({
        where: { id: dto.evidenceDocumentId },
      });
      if (!doc) {
        throw new NotFoundException(`Không tìm thấy tài liệu minh chứng với ID #${dto.evidenceDocumentId}`);
      }
    }

    const updated = await this.prisma.acceptanceRecord.update({
      where: { id },
      data: {
        acceptanceDate: dto.acceptanceDate ? new Date(dto.acceptanceDate) : undefined,
        content: dto.content !== undefined ? dto.content.trim() : undefined,
        result: dto.result !== undefined ? dto.result : undefined,
        issues: dto.issues !== undefined ? (dto.issues ? dto.issues.trim() : null) : undefined,
        evidenceDocumentId: dto.evidenceDocumentId !== undefined ? dto.evidenceDocumentId : undefined,
      },
      include: {
        contract: {
          select: {
            contractCode: true,
            contractName: true,
          },
        },
        evidenceDocument: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'UPDATE_ACCEPTANCE_RECORD',
        entityType: 'CONTRACT',
        entityId: existing.contractId,
        description: `Cập nhật hồ sơ nghiệm thu ${existing.acceptanceCode} (Kết quả: ${updated.result})`,
      },
    });

    return updated;
  }

  /**
   * ĐÍNH KÈM TÀI LIỆU MINH CHỨNG
   */
  async attachEvidence(id: number, dto: AttachEvidenceDto, userId?: number) {
    const existing = await this.findOne(id);
    let docId = dto.documentId;

    if (!docId && dto.filePath) {
      const newDoc = await this.prisma.document.create({
        data: {
          documentName: dto.documentName || `Minh chứng nghiệm thu - ${existing.acceptanceCode}`,
          filePath: dto.filePath,
          fileType: dto.fileType || 'PDF',
          documentType: 'ACCEPTANCE_EVIDENCE',
          uploadedBy: userId || null,
        },
      });
      docId = newDoc.id;
    }

    if (!docId) {
      throw new BadRequestException('Vui lòng cung cấp documentId hoặc (filePath, documentName) của tài liệu minh chứng');
    }

    const updated = await this.prisma.acceptanceRecord.update({
      where: { id },
      data: {
        evidenceDocumentId: docId,
      },
      include: {
        evidenceDocument: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'ATTACH_ACCEPTANCE_EVIDENCE',
        entityType: 'CONTRACT',
        entityId: existing.contractId,
        description: `Đính kèm tài liệu minh chứng (Doc #${docId}) vào hồ sơ nghiệm thu ${existing.acceptanceCode}`,
      },
    });

    return updated;
  }
}
