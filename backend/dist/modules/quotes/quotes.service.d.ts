import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { FilterQuoteDto } from './dto/filter-quote.dto.js';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto.js';
export declare class QuotesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getServices(): Promise<{
        status: string;
        createdAt: Date;
        id: number;
        serviceName: string;
        description: string | null;
        unit: string | null;
        unitPrice: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    create(createQuoteDto: CreateQuoteDto, userId?: number): Promise<{
        customer: {
            email: string | null;
            id: number;
            taxCode: string | null;
            phone: string | null;
            customerName: string;
        };
        items: ({
            service: {
                status: string;
                createdAt: Date;
                id: number;
                serviceName: string;
                description: string | null;
                unit: string | null;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
            id: number;
            description: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
        })[];
    } & {
        status: string;
        id: number;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        customerId: number;
        quotationCode: string;
        createdDate: Date;
        validUntil: Date | null;
        note: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    findAll(query: FilterQuoteDto): Promise<{
        items: ({
            customer: {
                email: string | null;
                id: number;
                phone: string | null;
                customerName: string;
            };
            contract: {
                status: string;
                id: number;
                contractCode: string;
            } | null;
            _count: {
                items: number;
            };
        } & {
            status: string;
            id: number;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            customerId: number;
            quotationCode: string;
            createdDate: Date;
            validUntil: Date | null;
            note: string | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        customer: {
            email: string | null;
            status: string;
            createdAt: Date;
            id: number;
            taxCode: string | null;
            address: string | null;
            phone: string | null;
            customerName: string;
            contactPerson: string | null;
        };
        contract: {
            status: string;
            id: number;
            contractCode: string;
            contractName: string;
        } | null;
        items: ({
            service: {
                status: string;
                createdAt: Date;
                id: number;
                serviceName: string;
                description: string | null;
                unit: string | null;
                unitPrice: import("@prisma/client-runtime-utils").Decimal;
            } | null;
        } & {
            id: number;
            description: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
        })[];
    } & {
        status: string;
        id: number;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        customerId: number;
        quotationCode: string;
        createdDate: Date;
        validUntil: Date | null;
        note: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    update(id: number, updateQuoteDto: UpdateQuoteDto, userId?: number): Promise<{
        customer: {
            email: string | null;
            status: string;
            createdAt: Date;
            id: number;
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
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
        }[];
    } & {
        status: string;
        id: number;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        customerId: number;
        quotationCode: string;
        createdDate: Date;
        validUntil: Date | null;
        note: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    updateStatus(id: number, dto: UpdateQuoteStatusDto, userId?: number): Promise<{
        customer: {
            email: string | null;
            status: string;
            createdAt: Date;
            id: number;
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
            serviceId: number | null;
            quantity: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            taxRate: import("@prisma/client-runtime-utils").Decimal | null;
            lineTotal: import("@prisma/client-runtime-utils").Decimal;
            quotationId: number;
        }[];
    } & {
        status: string;
        id: number;
        discountAmount: import("@prisma/client-runtime-utils").Decimal;
        customerId: number;
        quotationCode: string;
        createdDate: Date;
        validUntil: Date | null;
        note: string | null;
        subtotal: import("@prisma/client-runtime-utils").Decimal;
        taxAmount: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    sendQuote(id: number, userId?: number): Promise<{
        quotationCode: string;
        recipient: string | null;
        status: string;
        sentAt: Date;
    }>;
    convertToContract(id: number, userId?: number): Promise<{
        status: string;
        createdAt: Date;
        id: number;
        customerId: number;
        contractCode: string;
        quotationId: number | null;
        templateVersionId: number | null;
        contractName: string;
        contractValue: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date | null;
        endDate: Date | null;
        contractContent: string | null;
        documentId: number | null;
    }>;
    getHistory(id: number): Promise<({
        user: {
            username: string;
            fullName: string;
            id: number;
        } | null;
    } & {
        createdAt: Date;
        id: number;
        description: string | null;
        action: string;
        entityType: string | null;
        entityId: number | null;
        userId: number | null;
    })[]>;
    remove(id: number, userId?: number): Promise<{
        message: string;
    }>;
}
