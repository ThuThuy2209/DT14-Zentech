import { QuotesService } from './quotes.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { FilterQuoteDto } from './dto/filter-quote.dto.js';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto.js';
export declare class QuotesController {
    private readonly quotesService;
    constructor(quotesService: QuotesService);
    getServices(): Promise<{
        success: boolean;
        message: string;
        data: {
            status: string;
            createdAt: Date;
            id: number;
            serviceName: string;
            description: string | null;
            unit: string | null;
            unitPrice: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    create(createQuoteDto: CreateQuoteDto, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    findAll(query: FilterQuoteDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getHistory(id: number): Promise<{
        success: boolean;
        message: string;
        data: ({
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
        })[];
    }>;
    sendQuote(id: number, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            quotationCode: string;
            recipient: string | null;
            status: string;
            sentAt: Date;
        };
    }>;
    convertToContract(id: number, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    update(id: number, updateQuoteDto: UpdateQuoteDto, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    updateStatus(id: number, updateQuoteStatusDto: UpdateQuoteStatusDto, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    remove(id: number, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: null;
    }>;
}
