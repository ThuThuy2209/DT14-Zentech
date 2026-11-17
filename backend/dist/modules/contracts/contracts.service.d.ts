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
            templateId: number;
            versionNumber: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        description: string | null;
        templateName: string;
    })[]>;
    createTemplate(dto: CreateTemplateDto): Promise<{
        versions: {
            id: number;
            createdAt: Date;
            templateId: number;
            versionNumber: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: number;
        status: string;
        createdAt: Date;
        description: string | null;
        templateName: string;
    }>;
    private seedDefaultTemplateIfEmpty;
    create(createContractDto: CreateContractDto, userId?: number): Promise<{
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
        templateVersion: ({
            template: {
                id: number;
                status: string;
                createdAt: Date;
                description: string | null;
                templateName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            templateId: number;
            versionNumber: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }) | null;
    } & {
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
    findAll(query: FilterContractDto): Promise<{
        items: ({
            _count: {
                acceptanceRecords: number;
                salesInvoices: number;
                signers: number;
                signatureRequests: number;
            };
            customer: {
                id: number;
                email: string | null;
                phone: string | null;
                customerName: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
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
            invoiceNumber: string;
            invoiceDate: Date;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            id: number;
            dueDate: Date | null;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
            paymentStatus: string;
            documentId: number | null;
            createdAt: Date;
            customerId: number;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            contractId: number | null;
            acceptanceId: number | null;
            invoiceStatus: string;
            issueDate: Date | null;
            updatedAt: Date;
        }[];
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
        quotation: {
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
        } | null;
        templateVersion: ({
            template: {
                id: number;
                status: string;
                createdAt: Date;
                description: string | null;
                templateName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            templateId: number;
            versionNumber: number;
            content: string;
            placeholderConfig: import("@prisma/client/runtime/client").JsonValue | null;
        }) | null;
        signers: {
            id: number;
            contractId: number;
            signerName: string;
            signerEmail: string;
            signerRole: string | null;
            signingOrder: number | null;
            signingStatus: string;
        }[];
        signatureRequests: ({
            events: {
                id: number;
                signatureRequestId: number;
                eventType: string;
                eventStatus: string;
                eventMessage: string | null;
                eventTime: Date;
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
    update(id: number, updateContractDto: UpdateContractDto, userId?: number): Promise<{
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
        signers: {
            id: number;
            contractId: number;
            signerName: string;
            signerEmail: string;
            signerRole: string | null;
            signingOrder: number | null;
            signingStatus: string;
        }[];
    } & {
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
    remove(id: number, userId?: number): Promise<{
        message: string;
    }>;
    addSigner(contractId: number, dto: AddSignerDto): Promise<{
        id: number;
        contractId: number;
        signerName: string;
        signerEmail: string;
        signerRole: string | null;
        signingOrder: number | null;
        signingStatus: string;
    }>;
    getSigners(contractId: number): Promise<{
        id: number;
        contractId: number;
        signerName: string;
        signerEmail: string;
        signerRole: string | null;
        signingOrder: number | null;
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
                contractId: number;
                signerName: string;
                signerEmail: string;
                signerRole: string | null;
                signingOrder: number | null;
                signingStatus: string;
            }[];
            signatureRequests: ({
                events: {
                    id: number;
                    signatureRequestId: number;
                    eventType: string;
                    eventStatus: string;
                    eventMessage: string | null;
                    eventTime: Date;
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
        };
    }>;
    getSigningStatus(contractId: number): Promise<({
        events: {
            id: number;
            signatureRequestId: number;
            eventType: string;
            eventStatus: string;
            eventMessage: string | null;
            eventTime: Date;
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
