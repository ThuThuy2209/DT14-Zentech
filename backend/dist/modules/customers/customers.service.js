var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ConflictException, Injectable, NotFoundException, } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCustomerDto) {
        if (createCustomerDto.taxCode) {
            const normalizedTaxCode = createCustomerDto.taxCode.trim();
            const existing = await this.prisma.customer.findFirst({
                where: { taxCode: normalizedTaxCode },
            });
            if (existing) {
                throw new ConflictException(`Mã số thuế "${normalizedTaxCode}" đã tồn tại cho khách hàng "${existing.customerName}"!`);
            }
        }
        return this.prisma.customer.create({
            data: {
                customerName: createCustomerDto.customerName.trim(),
                taxCode: createCustomerDto.taxCode?.trim() || null,
                address: createCustomerDto.address?.trim() || null,
                email: createCustomerDto.email?.trim() || null,
                phone: createCustomerDto.phone?.trim() || null,
                contactPerson: createCustomerDto.contactPerson?.trim() || null,
                status: createCustomerDto.status ?? 'ACTIVE',
            },
        });
    }
    async findAll(query) {
        const page = query.page && query.page > 0 ? Number(query.page) : 1;
        const limit = query.limit && query.limit > 0 ? Number(query.limit) : 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (query.status) {
            where.status = query.status;
        }
        if (query.search && query.search.trim()) {
            const keyword = query.search.trim();
            where.OR = [
                { customerName: { contains: keyword, mode: 'insensitive' } },
                { taxCode: { contains: keyword, mode: 'insensitive' } },
                { phone: { contains: keyword, mode: 'insensitive' } },
                { email: { contains: keyword, mode: 'insensitive' } },
                { contactPerson: { contains: keyword, mode: 'insensitive' } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            quotations: true,
                            contracts: true,
                            salesInvoices: true,
                        },
                    },
                },
            }),
            this.prisma.customer.count({ where }),
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
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        quotations: true,
                        contracts: true,
                        salesInvoices: true,
                    },
                },
            },
        });
        if (!customer) {
            throw new NotFoundException(`Không tìm thấy khách hàng với ID #${id}`);
        }
        return customer;
    }
    async update(id, updateCustomerDto) {
        await this.findOne(id);
        if (updateCustomerDto.taxCode) {
            const normalizedTaxCode = updateCustomerDto.taxCode.trim();
            const existing = await this.prisma.customer.findFirst({
                where: {
                    taxCode: normalizedTaxCode,
                    NOT: { id },
                },
            });
            if (existing) {
                throw new ConflictException(`Mã số thuế "${normalizedTaxCode}" đã thuộc về khách hàng "${existing.customerName}"!`);
            }
        }
        return this.prisma.customer.update({
            where: { id },
            data: {
                ...(updateCustomerDto.customerName && {
                    customerName: updateCustomerDto.customerName.trim(),
                }),
                ...(updateCustomerDto.taxCode !== undefined && {
                    taxCode: updateCustomerDto.taxCode?.trim() || null,
                }),
                ...(updateCustomerDto.address !== undefined && {
                    address: updateCustomerDto.address?.trim() || null,
                }),
                ...(updateCustomerDto.email !== undefined && {
                    email: updateCustomerDto.email?.trim() || null,
                }),
                ...(updateCustomerDto.phone !== undefined && {
                    phone: updateCustomerDto.phone?.trim() || null,
                }),
                ...(updateCustomerDto.contactPerson !== undefined && {
                    contactPerson: updateCustomerDto.contactPerson?.trim() || null,
                }),
                ...(updateCustomerDto.status && { status: updateCustomerDto.status }),
            },
        });
    }
    async remove(id) {
        const customer = await this.findOne(id);
        const hasTransactions = customer._count.quotations > 0 ||
            customer._count.contracts > 0 ||
            customer._count.salesInvoices > 0;
        if (hasTransactions) {
            await this.prisma.customer.update({
                where: { id },
                data: { status: 'INACTIVE' },
            });
            return {
                isSoftDeleted: true,
                message: 'Khách hàng đã phát sinh giao dịch (báo giá/hợp đồng/hóa đơn), hệ thống đã chuyển trạng thái sang ngưng hoạt động (INACTIVE) để bảo toàn dữ liệu.',
            };
        }
        await this.prisma.customer.delete({ where: { id } });
        return {
            isSoftDeleted: false,
            message: `Đã xóa hoàn toàn khách hàng "${customer.customerName}" khỏi hệ thống.`,
        };
    }
};
CustomersService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PrismaService])
], CustomersService);
export { CustomersService };
//# sourceMappingURL=customers.service.js.map