import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateContractDto } from './dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto.js';
import { FilterContractDto } from './dto/filter-contract.dto.js';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { AddSignerDto } from './dto/add-signer.dto.js';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  // PHẦN 1: MẪU HỢP ĐỒNG (TEMPLATES)

  /**
   * Lấy danh sách mẫu hợp đồng và các phiên bản
   */
  async getTemplates() {
    await this.seedDefaultTemplateIfEmpty();
    return this.prisma.contractTemplate.findMany({
      where: { status: 'ACTIVE' },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  /**
   * Tạo mẫu hợp đồng mới
   */
  async createTemplate(dto: CreateTemplateDto) {
    return this.prisma.contractTemplate.create({
      data: {
        templateName: dto.templateName.trim(),
        description: dto.description?.trim() || null,
        status: 'ACTIVE',
        versions: {
          create: {
            versionNumber: 1,
            content: dto.content,
            placeholderConfig: dto.placeholderConfig || {
              placeholders: [
                '{{customer_name}}',
                '{{tax_code}}',
                '{{customer_address}}',
                '{{representative}}',
                '{{contract_value}}',
                '{{contract_code}}',
                '{{date}}',
              ],
            },
          },
        },
      },
      include: {
        versions: true,
      },
    });
  }

  /**
   * Khởi tạo mẫu Hợp đồng mặc định nếu DB chưa có
   */
  private async seedDefaultTemplateIfEmpty() {
    try {
      const count = await this.prisma.contractTemplate.count();
      if (count === 0) {
        await this.prisma.contractTemplate.create({
          data: {
            templateName: 'Hợp đồng Dịch vụ Phát triển Phần mềm & Vận hành',
            description: 'Mẫu hợp đồng kinh tế chuẩn dành cho dịch vụ CNTT và bảo trì hệ thống',
            status: 'ACTIVE',
            versions: {
              create: {
                versionNumber: 1,
                content: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n-----------------------------\n\nHỢP ĐỒNG DỊCH VỤ PHẦN MỀM\nSố: {{contract_code}}\n\nHôm nay, ngày {{date}}, tại TP. Hồ Chí Minh, chúng tôi gồm có:\n\nBÊN A (BÊN CUNG CẤP DỊCH VỤ):\n- Tên công ty: Công ty TNHH Một thành viên Minh Software\n- Mã số thuế: 0312345678\n- Đại diện: Ông Nguyễn Văn Minh - Chức vụ: Giám đốc\n\nBÊN B (BÊN SỬ DỤNG DỊCH VỤ):\n- Tên khách hàng: {{customer_name}}\n- Mã số thuế: {{tax_code}}\n- Địa chỉ: {{customer_address}}\n- Đại diện: {{representative}}\n\nHai bên cùng thống nhất ký kết hợp đồng dịch vụ với tổng giá trị: {{contract_value}} VNĐ.\nThời hạn và tiến độ thanh toán theo các mốc nghiệm thu thỏa thuận.`,
                placeholderConfig: {
                  placeholders: [
                    '{{customer_name}}',
                    '{{tax_code}}',
                    '{{customer_address}}',
                    '{{representative}}',
                    '{{contract_value}}',
                    '{{contract_code}}',
                    '{{date}}',
                  ],
                },
              },
            },
          },
        });
      }
    } catch {
      // bỏ qua nếu lỗi seed
    }
  }
  // PHẦN 2: HỢP ĐỒNG (CONTRACTS)

  /**
   *  TẠO HỢP ĐỒNG (TỰ SINH MÃ HOẶC TỪ BÁO GIÁ / MẪU)
   */
  async create(createContractDto: CreateContractDto, userId?: number) {
    // 1. Kiểm tra khách hàng
    const customer = await this.prisma.customer.findUnique({
      where: { id: createContractDto.customerId },
    });
    if (!customer) {
      throw new NotFoundException(
        `Không tìm thấy khách hàng với ID #${createContractDto.customerId}`,
      );
    }

    // 2. Tự sinh mã hợp đồng chuẩn: HD-YYYYMM-XXXX
    let contractCode = createContractDto.contractCode?.trim();
    if (!contractCode) {
      const now = new Date();
      const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
      const count = await this.prisma.contract.count({
        where: { contractCode: { startsWith: `HD-${yearMonth}` } },
      });
      contractCode = `HD-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
    } else {
      const existing = await this.prisma.contract.findUnique({
        where: { contractCode },
      });
      if (existing) {
        throw new ConflictException(
          `Mã hợp đồng "${contractCode}" đã tồn tại trên hệ thống!`,
        );
      }
    }

    // 3. Nếu có templateVersionId: Tự động điền trường thay thế (FR-41, FR-42)
    let contractContent = createContractDto.contractContent;
    if (createContractDto.templateVersionId) {
      const templateVersion = await this.prisma.contractTemplateVersion.findUnique({
        where: { id: createContractDto.templateVersionId },
      });
      if (templateVersion) {
        contractContent = templateVersion.content
          .replace(/{{contract_code}}/g, contractCode)
          .replace(/{{customer_name}}/g, customer.customerName)
          .replace(/{{tax_code}}/g, customer.taxCode || 'Chưa cung cấp')
          .replace(/{{customer_address}}/g, customer.address || 'Chưa cung cấp')
          .replace(/{{representative}}/g, customer.contactPerson || customer.customerName)
          .replace(
            /{{contract_value}}/g,
            Number(createContractDto.contractValue).toLocaleString('vi-VN'),
          )
          .replace(/{{date}}/g, new Date().toLocaleDateString('vi-VN'));
      }
    }

    if (!contractContent) {
      contractContent = `Hợp đồng dịch vụ kinh tế số ${contractCode} giữa Công ty TNHH MTV Minh Software và khách hàng ${customer.customerName}. Tổng giá trị hợp đồng: ${Number(createContractDto.contractValue).toLocaleString('vi-VN')} VNĐ.`;
    }

    // 4. Lưu hợp đồng trong Transaction & tự động tạo người ký mặc định
    return this.prisma.$transaction(async (tx) => {
      const contract = await tx.contract.create({
        data: {
          contractCode,
          contractName: createContractDto.contractName.trim(),
          customerId: createContractDto.customerId,
          quotationId: createContractDto.quotationId || null,
          templateVersionId: createContractDto.templateVersionId || null,
          contractValue: createContractDto.contractValue,
          startDate: createContractDto.startDate
            ? new Date(createContractDto.startDate)
            : new Date(),
          endDate: createContractDto.endDate
            ? new Date(createContractDto.endDate)
            : null,
          contractContent,
          status: createContractDto.status ?? 'DRAFT',
        },
        include: {
          customer: true,
          templateVersion: {
            include: { template: true },
          },
        },
      });

      // Tự động thêm 2 bên ký mặc định (ông Minh và đại diện khách hàng)
      await tx.contractSigner.createMany({
        data: [
          {
            contractId: contract.id,
            signerName: 'Nguyễn Văn Minh',
            signerEmail: 'minh.software@example.com',
            signerRole: 'Đại diện Bên A (Giám đốc)',
            signingOrder: 1,
            signingStatus: 'PENDING',
          },
          ...(customer.email
            ? [
                {
                  contractId: contract.id,
                  signerName: customer.contactPerson || customer.customerName,
                  signerEmail: customer.email,
                  signerRole: 'Đại diện Bên B (Khách hàng)',
                  signingOrder: 2,
                  signingStatus: 'PENDING',
                },
              ]
            : []),
        ],
      });

      // Ghi nhật ký hoạt động
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: 'CREATE_CONTRACT',
          entityType: 'CONTRACT',
          entityId: contract.id,
          description: `Tạo mới Hợp đồng ${contract.contractCode} - "${contract.contractName}" với giá trị ${Number(contract.contractValue).toLocaleString('vi-VN')} đ`,
        },
      });

      return contract;
    });
  }

  /**
   * FR-43: LẤY DANH SÁCH HỢP ĐỒNG CÓ PHÂN TRANG & TÌM KIẾM
   */
  async findAll(query: FilterContractDto) {
    const page = query.page && query.page > 0 ? Number(query.page) : 1;
    const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.customerId) {
      where.customerId = Number(query.customerId);
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const keyword = query.search.trim();
      where.OR = [
        { contractCode: { contains: keyword, mode: 'insensitive' } },
        { contractName: { contains: keyword, mode: 'insensitive' } },
        { customer: { customerName: { contains: keyword, mode: 'insensitive' } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.contract.findMany({
        where,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              customerName: true,
              phone: true,
              email: true,
            },
          },
          _count: {
            select: {
              signers: true,
              signatureRequests: true,
              acceptanceRecords: true,
              salesInvoices: true,
            },
          },
        },
      }),
      this.prisma.contract.count({ where }),
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
   * XEM CHI TIẾT 1 HỢP ĐỒNG ĐẦY ĐỦ CÁC QUAN HỆ
   */
  async findOne(id: number) {
    const contract = await this.prisma.contract.findUnique({
      where: { id },
      include: {
        customer: true,
        quotation: true,
        templateVersion: {
          include: { template: true },
        },
        signers: {
          orderBy: { signingOrder: 'asc' },
        },
        signatureRequests: {
          orderBy: { id: 'desc' },
          include: {
            events: {
              orderBy: { eventTime: 'asc' },
            },
          },
        },
        acceptanceRecords: {
          orderBy: { id: 'desc' },
        },
        salesInvoices: true,
      },
    });

    if (!contract) {
      throw new NotFoundException(`Không tìm thấy hợp đồng với ID #${id}`);
    }

    return contract;
  }

  /**
   * CẬP NHẬT THÔNG TIN HỢP ĐỒNG
   */
  async update(id: number, updateContractDto: UpdateContractDto, userId?: number) {
    const contract = await this.findOne(id);

    // Hợp đồng đã gửi ký hoặc đã ký không được sửa nội dung trực tiếp
    if (contract.status === 'SIGNED' || contract.status === 'SIGNING') {
      throw new BadRequestException(
        `Theo quy tắc BR-11: Hợp đồng đang ở trạng thái "${contract.status}", không thể chỉnh sửa trực tiếp nội dung!`,
      );
    }

    const updated = await this.prisma.contract.update({
      where: { id },
      data: {
        ...(updateContractDto.contractName && {
          contractName: updateContractDto.contractName.trim(),
        }),
        ...(updateContractDto.contractValue && {
          contractValue: updateContractDto.contractValue,
        }),
        ...(updateContractDto.startDate && {
          startDate: new Date(updateContractDto.startDate),
        }),
        ...(updateContractDto.endDate !== undefined && {
          endDate: updateContractDto.endDate
            ? new Date(updateContractDto.endDate)
            : null,
        }),
        ...(updateContractDto.contractContent && {
          contractContent: updateContractDto.contractContent,
        }),
        ...(updateContractDto.status && { status: updateContractDto.status }),
      },
      include: {
        customer: true,
        signers: true,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'UPDATE_CONTRACT',
        entityType: 'CONTRACT',
        entityId: id,
        description: `Cập nhật thông tin hợp đồng ${contract.contractCode}`,
      },
    });

    return updated;
  }

  /**
   * XÓA HỢP ĐỒNG
   */
  async remove(id: number, userId?: number) {
    const contract = await this.findOne(id);

    if (
      contract.acceptanceRecords.length > 0 ||
      contract.salesInvoices.length > 0
    ) {
      throw new BadRequestException(
        `Hợp đồng "${contract.contractCode}" đã có biên bản nghiệm thu hoặc hóa đơn phát sinh, không thể xóa để bảo toàn dữ liệu kế toán!`,
      );
    }

    await this.prisma.activityLog.create({
      data: {
        userId: userId || null,
        action: 'DELETE_CONTRACT',
        entityType: 'CONTRACT',
        entityId: id,
        description: `Xóa hợp đồng ${contract.contractCode}`,
      },
    });

    await this.prisma.contract.delete({ where: { id } });

    return {
      message: `Đã xóa hợp đồng "${contract.contractCode}" thành công!`,
    };
  }

  // PHẦN 3: QUẢN LÝ NGƯỜI KÝ (SIGNERS)

  /**
   *Thêm người ký vào hợp đồng
   */
  async addSigner(contractId: number, dto: AddSignerDto) {
    const contract = await this.findOne(contractId);

    if (contract.status === 'SIGNED') {
      throw new BadRequestException(
        'Hợp đồng đã hoàn tất ký kết, không thể thêm người ký mới!',
      );
    }

    return this.prisma.contractSigner.create({
      data: {
        contractId,
        signerName: dto.signerName.trim(),
        signerEmail: dto.signerEmail.trim(),
        signerRole: dto.signerRole || 'Đại diện Khách hàng',
        signingOrder: dto.signingOrder || 1,
        signingStatus: 'PENDING',
      },
    });
  }

  /**
   * Lấy danh sách người ký của hợp đồng
   */
  async getSigners(contractId: number) {
    await this.findOne(contractId);
    return this.prisma.contractSigner.findMany({
      where: { contractId },
      orderBy: { signingOrder: 'asc' },
    });
  }

  // PHẦN 4: KÝ SỐ SANDBOX (SANDBOX SIGNING)

  /**
   * GỬI HỢP ĐỒNG ĐẾN CỔNG KÝ SỐ SANDBOX
   */
  async sendToSandboxSign(contractId: number, userId?: number) {
    const contract = await this.findOne(contractId);

    //Kiểm tra điều kiện ký
    if (contract.status === 'SIGNED') {
      throw new BadRequestException('Hợp đồng này đã được ký số thành công trước đó!');
    }

    if (!contract.signers || contract.signers.length === 0) {
      throw new BadRequestException(
        'Hợp đồng chưa có danh sách Người ký! Vui lòng thêm người ký trước khi gửi ký số.',
      );
    }

    // Sinh mã giao dịch Sandbox ngẫu nhiên chuẩn: SBX-TXN-YYYYMMDD-XXXXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionId = `SBX-TXN-${dateStr}-${randStr}`;

    return this.prisma.$transaction(async (tx) => {
      // 1. Tạo yêu cầu ký số Sandbox
      const sigRequest = await tx.contractSignatureRequest.create({
        data: {
          contractId,
          transactionId,
          requestStatus: 'SUCCESS', // Trong môi trường Sandbox giả lập ký số hoàn tất
          sentAt: now,
          completedAt: new Date(now.getTime() + 1000),
        },
      });

      // 2. Ghi nhận chuỗi sự kiện ký số Sandbox (FR-56)
      await tx.contractSignEvent.createMany({
        data: [
          {
            signatureRequestId: sigRequest.id,
            eventType: 'REQUEST_INITIATED',
            eventStatus: 'SUCCESS',
            eventMessage: 'Yêu cầu ký số hợp đồng đã gửi tới cổng ký số thử nghiệm Sandbox.',
            eventTime: now,
          },
          {
            signatureRequestId: sigRequest.id,
            eventType: 'CERTIFICATE_VERIFIED',
            eventStatus: 'SUCCESS',
            eventMessage: 'Chứng thư số thử nghiệm của các bên ký đã được cổng Sandbox xác thực hợp lệ.',
            eventTime: new Date(now.getTime() + 500),
          },
          {
            signatureRequestId: sigRequest.id,
            eventType: 'SIGNATURE_COMPLETED',
            eventStatus: 'SUCCESS',
            eventMessage: 'Toàn bộ các bên đã hoàn tất ký số điện tử trên môi trường Sandbox.',
            eventTime: new Date(now.getTime() + 1000),
          },
        ],
      });

      // 3. Cập nhật trạng thái tất cả người ký sang SIGNED
      await tx.contractSigner.updateMany({
        where: { contractId },
        data: { signingStatus: 'SIGNED' },
      });

      // 4. Cập nhật trạng thái hợp đồng sang SIGNED
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: 'SIGNED' },
        include: {
          signers: true,
          signatureRequests: {
            include: { events: true },
          },
        },
      });

      // Ghi nhật ký
      await tx.activityLog.create({
        data: {
          userId: userId || null,
          action: 'SIGN_CONTRACT_SANDBOX',
          entityType: 'CONTRACT',
          entityId: contractId,
          description: `Ký số thành công hợp đồng ${contract.contractCode} qua cổng Sandbox (Mã giao dịch: ${transactionId})`,
        },
      });

      return {
        message: 'Ký số hợp đồng qua cổng Sandbox thành công!',
        transactionId,
        contractStatus: updatedContract.status,
        signedAt: new Date(),
        contract: updatedContract,
      };
    });
  }

  /**
   *Xem trạng thái và lịch sử sự kiện ký số Sandbox
   */
  async getSigningStatus(contractId: number) {
    await this.findOne(contractId);

    return this.prisma.contractSignatureRequest.findMany({
      where: { contractId },
      orderBy: { id: 'desc' },
      include: {
        events: {
          orderBy: { eventTime: 'asc' },
        },
      },
    });
  }
}
