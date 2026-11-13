import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateContractDto } from './dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto.js';
import { FilterContractDto } from './dto/filter-contract.dto.js';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { AddSignerDto } from './dto/add-signer.dto.js';
export declare class ContractsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTemplates(): Promise<({
        versions: {
            id: number;
            createdAt: Date;
            versionNumber: number;
            templateId: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: number;
        templateName: string;
        description: string | null;
        status: string;
        createdAt: Date;
    })[]>;
    createTemplate(dto: CreateTemplateDto): Promise<{
        versions: {
            id: number;
            createdAt: Date;
            versionNumber: number;
            templateId: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: number;
        templateName: string;
        description: string | null;
        status: string;
        createdAt: Date;
    }>;
    private seedDefaultTemplateIfEmpty;
    create(createContractDto: CreateContractDto, userId?: number): Promise<{
        customer: {
            id: number;
            status: string;
            createdAt: Date;
            customerName: string;
            taxCode: string | null;
            address: string | null;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
        };
        templateVersion: ({
            template: {
                id: number;
                templateName: string;
                description: string | null;
                status: string;
                createdAt: Date;
            };
        } & {
            id: number;
            createdAt: Date;
            versionNumber: number;
            templateId: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }) | null;
    } & {
        id: number;
        status: string;
        createdAt: Date;
        contractCode: string;
        contractName: string;
        contractValue: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date | null;
        endDate: Date | null;
        contractContent: string | null;
        quotationId: number | null;
        customerId: number;
        templateVersionId: number | null;
        documentId: number | null;
    }>;
    findAll(query: FilterContractDto): Promise<{
        items: ({
            _count: {
                signers: number;
                signatureRequests: number;
                acceptanceRecords: number;
                salesInvoices: number;
            };
            customer: {
                id: number;
                customerName: string;
                email: string | null;
                phone: string | null;
            };
        } & {
            id: number;
            status: string;
            createdAt: Date;
            contractCode: string;
            contractName: string;
            contractValue: import("@prisma/client-runtime-utils").Decimal;
            startDate: Date | null;
            endDate: Date | null;
            contractContent: string | null;
            quotationId: number | null;
            customerId: number;
            templateVersionId: number | null;
            documentId: number | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        customer: {
            id: number;
            status: string;
            createdAt: Date;
            customerName: string;
            taxCode: string | null;
            address: string | null;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
        };
        quotation: {
            id: number;
            status: string;
            customerId: number;
            quotationCode: string;
            createdDate: Date;
            validUntil: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            discountAmount: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            note: string | null;
        } | null;
        templateVersion: ({
            template: {
                id: number;
                templateName: string;
                description: string | null;
                status: string;
                createdAt: Date;
            };
        } & {
            id: number;
            createdAt: Date;
            versionNumber: number;
            templateId: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }) | null;
        signers: {
            id: number;
            signingOrder: number | null;
            contractId: number;
            signerName: string;
            signerEmail: string;
            signerRole: string | null;
            signingStatus: string;
        }[];
        signatureRequests: ({
            events: {
                id: number;
                eventTime: Date;
                signatureRequestId: number;
                eventType: string;
                eventStatus: string;
                eventMessage: string | null;
            }[];
        } & {
            id: number;
            contractId: number;
            transactionId: string | null;
            requestStatus: string;
            sentAt: Date;
            completedAt: Date | null;
            errorMessage: string | null;
            signedDocumentId: number | null;
        })[];
        acceptanceRecords: {
            result: string;
            id: number;
            createdAt: Date;
            content: string | null;
            contractId: number;
            acceptanceCode: string;
            acceptanceDate: Date;
            issues: string | null;
            evidenceDocumentId: number | null;
        }[];
        salesInvoices: {
            id: number;
            createdAt: Date;
            customerId: number;
            documentId: number | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            contractId: number | null;
            invoiceNumber: string;
            acceptanceId: number | null;
            invoiceDate: Date;
            dueDate: Date | null;
            invoiceStatus: string;
            outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentStatus: string;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            issueDate: Date | null;
            updatedAt: Date;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        contractCode: string;
        contractName: string;
        contractValue: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date | null;
        endDate: Date | null;
        contractContent: string | null;
        quotationId: number | null;
        customerId: number;
        templateVersionId: number | null;
        documentId: number | null;
    }>;
    update(id: number, updateContractDto: UpdateContractDto, userId?: number): Promise<{
        customer: {
            id: number;
            status: string;
            createdAt: Date;
            customerName: string;
            taxCode: string | null;
            address: string | null;
            email: string | null;
            phone: string | null;
            contactPerson: string | null;
        };
        signers: {
            id: number;
            signingOrder: number | null;
            contractId: number;
            signerName: string;
            signerEmail: string;
            signerRole: string | null;
            signingStatus: string;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        contractCode: string;
        contractName: string;
        contractValue: import("@prisma/client-runtime-utils").Decimal;
        startDate: Date | null;
        endDate: Date | null;
        contractContent: string | null;
        quotationId: number | null;
        customerId: number;
        templateVersionId: number | null;
        documentId: number | null;
    }>;
    remove(id: number, userId?: number): Promise<{
        message: string;
    }>;
    addSigner(contractId: number, dto: AddSignerDto): Promise<{
        id: number;
        signingOrder: number | null;
        contractId: number;
        signerName: string;
        signerEmail: string;
        signerRole: string | null;
        signingStatus: string;
    }>;
    getSigners(contractId: number): Promise<{
        id: number;
        signingOrder: number | null;
        contractId: number;
        signerName: string;
        signerEmail: string;
        signerRole: string | null;
        signingStatus: string;
    }[]>;
    sendToSandboxSign(contractId: number, userId?: number): Promise<{
        message: string;
        transactionId: string;
        contractStatus: string;
        signedAt: Date;
        contract: {
            signers: {
                id: number;
                signingOrder: number | null;
                contractId: number;
                signerName: string;
                signerEmail: string;
                signerRole: string | null;
                signingStatus: string;
            }[];
            signatureRequests: ({
                events: {
                    id: number;
                    eventTime: Date;
                    signatureRequestId: number;
                    eventType: string;
                    eventStatus: string;
                    eventMessage: string | null;
                }[];
            } & {
                id: number;
                contractId: number;
                transactionId: string | null;
                requestStatus: string;
                sentAt: Date;
                completedAt: Date | null;
                errorMessage: string | null;
                signedDocumentId: number | null;
            })[];
        } & {
            id: number;
            status: string;
            createdAt: Date;
            contractCode: string;
            contractName: string;
            contractValue: import("@prisma/client-runtime-utils").Decimal;
            startDate: Date | null;
            endDate: Date | null;
            contractContent: string | null;
            quotationId: number | null;
            customerId: number;
            templateVersionId: number | null;
            documentId: number | null;
        };
    }>;
    getSigningStatus(contractId: number): Promise<({
        events: {
            id: number;
            eventTime: Date;
            signatureRequestId: number;
            eventType: string;
            eventStatus: string;
            eventMessage: string | null;
        }[];
    } & {
        id: number;
        contractId: number;
        transactionId: string | null;
        requestStatus: string;
        sentAt: Date;
        completedAt: Date | null;
        errorMessage: string | null;
        signedDocumentId: number | null;
    })[]>;
}
