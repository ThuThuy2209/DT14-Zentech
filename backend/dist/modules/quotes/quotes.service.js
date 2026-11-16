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
let QuotesService = class QuotesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getServices() {
        return this.prisma.service.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { id: 'asc' },
        });
    }
    async create(createQuoteDto, userId) {
        const customer = await this.prisma.customer.findUnique({
            where: { id: createQuoteDto.customerId },
        });
        if (!customer) {
            throw new NotFoundException(`Không tìm thấy khách hàng với ID #${createQuoteDto.customerId}`);
        }
        let quotationCode = createQuoteDto.quotationCode?.trim();
        if (!quotationCode) {
            const now = new Date();
            const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
            const countThisMonth = await this.prisma.quotation.count({
                where: {
                    quotationCode: { startsWith: `BG-${yearMonth}` },
                },
            });
            quotationCode = `BG-${yearMonth}-${String(countThisMonth + 1).padStart(4, '0')}`;
        }
        else {
            const existing = await this.prisma.quotation.findUnique({
                where: { quotationCode },
            });
            if (existing) {
                throw new ConflictException(`Mã báo giá "${quotationCode}" đã tồn tại trên hệ thống!`);
            }
        }
        let subtotal = 0;
        let totalDiscount = 0;
        let totalTax = 0;
        const itemsData = createQuoteDto.items.map((item) => {
            const quantity = Number(item.quantity);
            const unitPrice = Number(item.unitPrice);
            const discountAmount = Number(item.discountAmount ?? 0);
            const taxRate = Number(item.taxRate ?? 10);
            const lineSubtotal = quantity * unitPrice;
            const lineAfterDiscount = Math.max(0, lineSubtotal - discountAmount);
            const lineTax = (lineAfterDiscount * taxRate) / 100;
            const lineTotal = lineAfterDiscount + lineTax;
            subtotal += lineSubtotal;
            totalDiscount += discountAmount;
            totalTax += lineTax;
            return {
                serviceId: item.serviceId || null,
                description: item.description.trim(),
                quantity,
                unitPrice,
                discountAmount,
                taxRate,
                lineTotal: Math.round(lineTotal * 100) / 100,
            };
        });
        const totalAmount = subtotal - totalDiscount + totalTax;
        return this.prisma.$transaction(async (tx) => {
            const quote = await tx.quotation.create({
                data: {
                    quotationCode,
                    customerId: createQuoteDto.customerId,
                    createdDate: createQuoteDto.createdDate
                        ? new Date(createQuoteDto.createdDate)
                        : new Date(),
                    validUntil: createQuoteDto.validUntil
                        ? new Date(createQuoteDto.validUntil)
                        : null,
                    subtotal: Math.round(subtotal * 100) / 100,
                    discountAmount: Math.round(totalDiscount * 100) / 100,
                    taxAmount: Math.round(totalTax * 100) / 100,
                    totalAmount: Math.round(totalAmount * 100) / 100,
                    status: createQuoteDto.status ?? 'DRAFT',
                    note: createQuoteDto.note?.trim() || null,
                    items: {
                        create: itemsData,
                    },
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            customerName: true,
                            taxCode: true,
                            phone: true,
                            email: true,
                        },
                    },
                    items: {
                        include: {
                            service: true,
                        },
                    },
                },
            });
            await tx.activityLog.create({
                data: {
                    userId: userId || null,
                    action: 'CREATE_QUOTATION',
                    entityType: 'QUOTATION',
                    entityId: quote.id,
                    description: `Tạo mới báo giá ${quote.quotationCode} cho khách hàng ${customer.customerName} với tổng tiền ${Number(quote.totalAmount).toLocaleString('vi-VN')} đ`,
                },
            });
            return quote;
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
                { quotationCode: { contains: keyword, mode: 'insensitive' } },
                { customer: { customerName: { contains: keyword, mode: 'insensitive' } } },
                { note: { contains: keyword, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.quotation.findMany({
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
                    contract: {
                        select: {
                            id: true,
                            contractCode: true,
                            status: true,
                        },
                    },
                    _count: {
                        select: { items: true },
                    },
                },
            }),
            this.prisma.quotation.count({ where }),
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
        const quote = await this.prisma.quotation.findUnique({
            where: { id },
            include: {
                customer: true,
                items: {
                    include: {
                        service: true,
                    },
                    orderBy: { id: 'asc' },
                },
                contract: {
                    select: {
                        id: true,
                        contractCode: true,
                        contractName: true,
                        status: true,
                    },
                },
            },
        });
        if (!quote) {
            throw new NotFoundException(`Không tìm thấy báo giá với ID #${id}`);
        }
        return quote;
    }
    async update(id, updateQuoteDto, userId) {
        const quote = await this.findOne(id);
        if (quote.status === 'ACCEPTED' && quote.contract) {
            throw new BadRequestException(`Báo giá đã được phê duyệt và tạo Hợp đồng (${quote.contract.contractCode}), không thể chỉnh sửa!`);
        }
        if (updateQuoteDto.customerId && updateQuoteDto.customerId !== quote.customerId) {
            const customer = await this.prisma.customer.findUnique({
                where: { id: updateQuoteDto.customerId },
            });
            if (!customer) {
                throw new NotFoundException(`Không tìm thấy khách hàng với ID #${updateQuoteDto.customerId}`);
            }
        }
        if (updateQuoteDto.items && updateQuoteDto.items.length > 0) {
            let subtotal = 0;
            let totalDiscount = 0;
            let totalTax = 0;
            const itemsData = updateQuoteDto.items.map((item) => {
                const quantity = Number(item.quantity);
                const unitPrice = Number(item.unitPrice);
                const discountAmount = Number(item.discountAmount ?? 0);
                const taxRate = Number(item.taxRate ?? 10);
                const lineSubtotal = quantity * unitPrice;
                const lineAfterDiscount = Math.max(0, lineSubtotal - discountAmount);
                const lineTax = (lineAfterDiscount * taxRate) / 100;
                const lineTotal = lineAfterDiscount + lineTax;
                subtotal += lineSubtotal;
                totalDiscount += discountAmount;
                totalTax += lineTax;
                return {
                    serviceId: item.serviceId || null,
                    description: item.description.trim(),
                    quantity,
                    unitPrice,
                    discountAmount,
                    taxRate,
                    lineTotal: Math.round(lineTotal * 100) / 100,
                };
            });
            const totalAmount = subtotal - totalDiscount + totalTax;
            return this.prisma.$transaction(async (tx) => {
                await tx.quotationItem.deleteMany({
                    where: { quotationId: id },
                });
                const updated = await tx.quotation.update({
                    where: { id },
                    data: {
                        ...(updateQuoteDto.customerId && { customerId: updateQuoteDto.customerId }),
                        ...(updateQuoteDto.createdDate && {
                            createdDate: new Date(updateQuoteDto.createdDate),
                        }),
                        ...(updateQuoteDto.validUntil !== undefined && {
                            validUntil: updateQuoteDto.validUntil
                                ? new Date(updateQuoteDto.validUntil)
                                : null,
                        }),
                        ...(updateQuoteDto.note !== undefined && {
                            note: updateQuoteDto.note?.trim() || null,
                        }),
                        ...(updateQuoteDto.status && { status: updateQuoteDto.status }),
                        subtotal: Math.round(subtotal * 100) / 100,
                        discountAmount: Math.round(totalDiscount * 100) / 100,
                        taxAmount: Math.round(totalTax * 100) / 100,
                        totalAmount: Math.round(totalAmount * 100) / 100,
                        items: {
                            create: itemsData,
                        },
                    },
                    include: {
                        customer: true,
                        items: {
                            include: { service: true },
                        },
                    },
                });
                await tx.activityLog.create({
                    data: {
                        userId: userId || null,
                        action: 'UPDATE_QUOTATION',
                        entityType: 'QUOTATION',
                        entityId: id,
                        description: `Cập nhật nội dung & hạng mục báo giá ${updated.quotationCode}`,
                    },
                });
                return updated;
            });
        }
        const updated = await this.prisma.quotation.update({
            where: { id },
            data: {
                ...(updateQuoteDto.customerId && { customerId: updateQuoteDto.customerId }),
                ...(updateQuoteDto.createdDate && {
                    createdDate: new Date(updateQuoteDto.createdDate),
                }),
                ...(updateQuoteDto.validUntil !== undefined && {
                    validUntil: updateQuoteDto.validUntil
                        ? new Date(updateQuoteDto.validUntil)
                        : null,
                }),
                ...(updateQuoteDto.note !== undefined && {
                    note: updateQuoteDto.note?.trim() || null,
                }),
                ...(updateQuoteDto.status && { status: updateQuoteDto.status }),
            },
            include: {
                customer: true,
                items: true,
            },
        });
        await this.prisma.activityLog.create({
            data: {
                userId: userId || null,
                action: 'UPDATE_QUOTATION',
                entityType: 'QUOTATION',
                entityId: id,
                description: `Cập nhật thông tin chung báo giá ${updated.quotationCode}`,
            },
        });
        return updated;
    }
    async updateStatus(id, dto, userId) {
        const quote = await this.findOne(id);
        const updated = await this.prisma.quotation.update({
            where: { id },
            data: { status: dto.status },
            include: {
                customer: true,
                items: true,
            },
        });
        await this.prisma.activityLog.create({
            data: {
                userId: userId || null,
                action: 'CHANGE_QUOTATION_STATUS',
                entityType: 'QUOTATION',
                entityId: id,
                description: `Chuyển trạng thái báo giá ${quote.quotationCode} từ ${quote.status} sang ${dto.status}`,
            },
        });
        return updated;
    }
    async sendQuote(id, userId) {
        const quote = await this.findOne(id);
        if (!quote.customer.email) {
            throw new BadRequestException(`Khách hàng "${quote.customer.customerName}" chưa có địa chỉ email, vui lòng bổ sung email trước khi gửi!`);
        }
        return this.prisma.$transaction(async (tx) => {
            let updatedStatus = quote.status;
            if (quote.status === 'DRAFT') {
                updatedStatus = 'SENT';
                await tx.quotation.update({
                    where: { id },
                    data: { status: 'SENT' },
                });
            }
            const emailContent = `Kính gửi ${quote.customer.contactPerson || quote.customer.customerName},\n\nCông ty TNHH Một thành viên Minh Software trân trọng gửi đến Quý khách bảng báo giá dịch vụ số ${quote.quotationCode}.\nTổng giá trị thanh toán: ${Number(quote.totalAmount).toLocaleString('vi-VN')} VNĐ.\nThời hạn hiệu lực: ${quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('vi-VN') : 'Không giới hạn'}.\n\nTrân trọng!`;
            await tx.emailLog.create({
                data: {
                    recipient: quote.customer.email,
                    subject: `[Minh Software] Báo giá dịch vụ ${quote.quotationCode}`,
                    content: emailContent,
                    sentAt: new Date(),
                    sendStatus: 'SENT',
                },
            });
            await tx.activityLog.create({
                data: {
                    userId: userId || null,
                    action: 'SEND_QUOTATION_EMAIL',
                    entityType: 'QUOTATION',
                    entityId: id,
                    description: `Đã gửi email báo giá ${quote.quotationCode} đến ${quote.customer.email}`,
                },
            });
            return {
                quotationCode: quote.quotationCode,
                recipient: quote.customer.email,
                status: updatedStatus,
                sentAt: new Date(),
            };
        });
    }
    async convertToContract(id, userId) {
        const quote = await this.findOne(id);
        if (quote.status !== 'ACCEPTED') {
            throw new BadRequestException(`Theo quy tắc BR-08: Báo giá chỉ được chuyển thành hợp đồng khi ở trạng thái "ACCEPTED" (Khách hàng chấp nhận)! Trạng thái hiện tại: "${quote.status}".`);
        }
        if (quote.contract) {
            throw new ConflictException(`Theo quy tắc BR-09: Báo giá ${quote.quotationCode} đã được chuyển thành Hợp đồng "${quote.contract.contractCode}" trước đó!`);
        }
        const now = new Date();
        const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
        const contractCount = await this.prisma.contract.count({
            where: { contractCode: { startsWith: `HD-${yearMonth}` } },
        });
        const contractCode = `HD-${yearMonth}-${String(contractCount + 1).padStart(4, '0')}`;
        return this.prisma.$transaction(async (tx) => {
            const contract = await tx.contract.create({
                data: {
                    contractCode,
                    quotationId: quote.id,
                    customerId: quote.customerId,
                    contractName: `Hợp đồng dịch vụ theo báo giá ${quote.quotationCode}`,
                    contractValue: quote.totalAmount,
                    startDate: new Date(),
                    status: 'DRAFT',
                    contractContent: `Hợp đồng cung cấp dịch vụ phần mềm được xác lập dựa trên thỏa thuận Báo giá ${quote.quotationCode} ngày ${new Date(quote.createdDate).toLocaleDateString('vi-VN')}. Tổng giá trị hợp đồng: ${Number(quote.totalAmount).toLocaleString('vi-VN')} VNĐ.`,
                },
            });
            if (quote.customer.email) {
                await tx.contractSigner.create({
                    data: {
                        contractId: contract.id,
                        signerName: quote.customer.contactPerson || quote.customer.customerName,
                        signerEmail: quote.customer.email,
                        signerRole: 'Đại diện Khách hàng',
                        signingOrder: 1,
                        signingStatus: 'PENDING',
                    },
                });
            }
            await tx.activityLog.create({
                data: {
                    userId: userId || null,
                    action: 'CONVERT_TO_CONTRACT',
                    entityType: 'QUOTATION',
                    entityId: id,
                    description: `Chuyển đổi thành công báo giá ${quote.quotationCode} thành Hợp đồng ${contract.contractCode}`,
                },
            });
            return contract;
        });
    }
    async getHistory(id) {
        await this.findOne(id);
        return this.prisma.activityLog.findMany({
            where: {
                entityType: 'QUOTATION',
                entityId: id,
            },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const quote = await this.findOne(id);
        if (quote.contract) {
            throw new BadRequestException(`Không thể xóa báo giá đã liên kết với Hợp đồng "${quote.contract.contractCode}"!`);
        }
        await this.prisma.activityLog.create({
            data: {
                userId: userId || null,
                action: 'DELETE_QUOTATION',
                entityType: 'QUOTATION',
                entityId: id,
                description: `Xóa báo giá ${quote.quotationCode}`,
            },
        });
        await this.prisma.quotation.delete({
            where: { id },
        });
        return {
            message: `Đã xóa báo giá "${quote.quotationCode}" thành công!`,
        };
    }
};
QuotesService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], QuotesService);
export { QuotesService };
//# sourceMappingURL=quotes.service.js.map