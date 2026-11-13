var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let ContractsService = class ContractsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async createTemplate(dto) {
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
    async seedDefaultTemplateIfEmpty() {
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
        }
        catch {
        }
    }
    async create(createContractDto, userId) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: createContractDto.customerId },
        });
        if (!customer) {
            throw new NotFoundException(`Không tìm thấy khách hàng với ID #${createContractDto.customerId}`);
        }
        let contractCode = createContractDto.contractCode?.trim();
        if (!contractCode) {
            const now = new Date();
            const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
            const count = await this.prisma.contract.count({
                where: { contractCode: { startsWith: `HD-${yearMonth}` } },
            });
            contractCode = `HD-${yearMonth}-${String(count + 1).padStart(4, '0')}`;
        }
        else {
            const existing = await this.prisma.contract.findUnique({
                where: { contractCode },
            });
            if (existing) {
                throw new ConflictException(`Mã hợp đồng "${contractCode}" đã tồn tại trên hệ thống!`);
            }
        }
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
                    .replace(/{{contract_value}}/g, Number(createContractDto.contractValue).toLocaleString('vi-VN'))
                    .replace(/{{date}}/g, new Date().toLocaleDateString('vi-VN'));
            }
        }
        if (!contractContent) {
            contractContent = `Hợp đồng dịch vụ kinh tế số ${contractCode} giữa Công ty TNHH MTV Minh Software và khách hàng ${customer.customerName}. Tổng giá trị hợp đồng: ${Number(createContractDto.contractValue).toLocaleString('vi-VN')} VNĐ.`;
        }
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
    async findAll(query) {
        const page = query.page && query.page > 0 ? Number(query.page) : 1;
        const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
        const skip = (page - 1) * limit;
        const where = {};
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
    async findOne(id) {
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
    async update(id, updateContractDto, userId) {
        const contract = await this.findOne(id);
        if (contract.status === 'SIGNED' || contract.status === 'SIGNING') {
            throw new BadRequestException(`Theo quy tắc BR-11: Hợp đồng đang ở trạng thái "${contract.status}", không thể chỉnh sửa trực tiếp nội dung!`);
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
    async remove(id, userId) {
        const contract = await this.findOne(id);
        if (contract.acceptanceRecords.length > 0 ||
            contract.salesInvoices.length > 0) {
            throw new BadRequestException(`Hợp đồng "${contract.contractCode}" đã có biên bản nghiệm thu hoặc hóa đơn phát sinh, không thể xóa để bảo toàn dữ liệu kế toán!`);
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
    async addSigner(contractId, dto) {
        const contract = await this.findOne(contractId);
        if (contract.status === 'SIGNED') {
            throw new BadRequestException('Hợp đồng đã hoàn tất ký kết, không thể thêm người ký mới!');
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
    async getSigners(contractId) {
        await this.findOne(contractId);
        return this.prisma.contractSigner.findMany({
            where: { contractId },
            orderBy: { signingOrder: 'asc' },
        });
    }
    async sendToSandboxSign(contractId, userId) {
        const contract = await this.findOne(contractId);
        if (contract.status === 'SIGNED') {
            throw new BadRequestException('Hợp đồng này đã được ký số thành công trước đó!');
        }
        if (!contract.signers || contract.signers.length === 0) {
            throw new BadRequestException('Hợp đồng chưa có danh sách Người ký! Vui lòng thêm người ký trước khi gửi ký số.');
        }
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const randStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const transactionId = `SBX-TXN-${dateStr}-${randStr}`;
        return this.prisma.$transaction(async (tx) => {
            const sigRequest = await tx.contractSignatureRequest.create({
                data: {
                    contractId,
                    transactionId,
                    requestStatus: 'SUCCESS',
                    sentAt: now,
                    completedAt: new Date(now.getTime() + 1000),
                },
            });
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
            await tx.contractSigner.updateMany({
                where: { contractId },
                data: { signingStatus: 'SIGNED' },
            });
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
    async getSigningStatus(contractId) {
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
};
ContractsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], ContractsService);
export { ContractsService };
//# sourceMappingURL=contracts.service.js.map