import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { FilterQuoteDto } from './dto/filter-quote.dto.js';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto.js';
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getServices(): Promise<{
        id: number;
        status: string;
        createdAt: Date;
        serviceName: string;
        description: string | null;
        unit: string | null;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    create(createQuoteDto: CreateQuoteDto, userId?: number): Promise<{
        customer: {
            id: number;
            email: string | null;
            taxCode: string | null;
            phone: string | null;
            customerName: string;
        };
        items: ({
            service: {
                id: number;
                status: string;
                createdAt: Date;
                serviceName: string;
                description: string | null;
                unit: string | null;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
            id: number;
            description: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
        })[];
    } & {
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        id: number;
        status: string;
        quotationCode: string;
        customerId: number;
        createdDate: Date;
        validUntil: Date | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
    }>;
    findAll(query: FilterQuoteDto): Promise<{
        items: ({
            _count: {
                items: number;
            };
            customer: {
                id: number;
                email: string | null;
                phone: string | null;
                customerName: string;
            };
            contract: {
                id: number;
                status: string;
                contractCode: string;
            } | null;
        } & {
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            id: number;
            status: string;
            quotationCode: string;
            customerId: number;
            createdDate: Date;
            validUntil: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        customer: {
            id: number;
            email: string | null;
            status: string;
            createdAt: Date;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        };
        contract: {
            id: number;
            status: string;
            contractCode: string;
            contractName: string;
        } | null;
        items: ({
            service: {
                id: number;
                status: string;
                createdAt: Date;
                serviceName: string;
                description: string | null;
                unit: string | null;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
            id: number;
            description: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
        })[];
    } & {
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        id: number;
        status: string;
        quotationCode: string;
        customerId: number;
        createdDate: Date;
        validUntil: Date | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
    }>;
    update(id: number, updateQuoteDto: UpdateQuoteDto, userId?: number): Promise<{
        customer: {
            id: number;
            email: string | null;
            status: string;
            createdAt: Date;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        };
        items: {
            id: number;
            description: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        id: number;
        status: string;
        quotationCode: string;
        customerId: number;
        createdDate: Date;
        validUntil: Date | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
    }>;
    updateStatus(id: number, dto: UpdateQuoteStatusDto, userId?: number): Promise<{
        customer: {
            id: number;
            email: string | null;
            status: string;
            createdAt: Date;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        };
        items: {
            id: number;
            description: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        id: number;
        status: string;
        quotationCode: string;
        customerId: number;
        createdDate: Date;
        validUntil: Date | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        note: string | null;
    }>;
    sendQuote(id: number, userId?: number): Promise<{
        quotationCode: string;
        recipient: string | null;
        status: string;
        sentAt: Date;
    }>;
    convertToContract(id: number, userId?: number): Promise<{
        id: number;
        documentId: number | null;
        status: string;
        createdAt: Date;
        customerId: number;
        quotationId: number | null;
        contractCode: string;
        templateVersionId: number | null;
        contractName: string;
        contractValue: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date | null;
        endDate: Date | null;
        contractContent: string | null;
    }>;
    getHistory(id: number): Promise<({
        user: {
            id: number;
            username: string;
            fullName: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        description: string | null;
        userId: number | null;
        action: string;
        entityType: string | null;
        entityId: number | null;
    })[]>;
    remove(id: number, userId?: number): Promise<{
        message: string;
    }>;
}
