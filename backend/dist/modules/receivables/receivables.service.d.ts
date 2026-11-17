import { PrismaService } from '../../prisma/prisma.service.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { FilterReceivableDto } from './dto/filter-receivable.dto.js';
import { CreateReminderDraftDto } from './dto/create-reminder-draft.dto.js';
import { ApproveReminderDto } from './dto/approve-reminder.dto.js';
export declare class ReceivablesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    recordPayment(dto: RecordPaymentDto, userId?: number): Promise<{
        payment: {
            id: number;
            paymentStatus: string;
            createdAt: Date;
            note: string | null;
            salesInvoiceId: number;
            paymentDate: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: string | null;
            transactionReference: string | null;
        };
        invoice: {
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
            payments: {
                id: number;
                paymentStatus: string;
                createdAt: Date;
                note: string | null;
                salesInvoiceId: number;
                paymentDate: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
                paymentMethod: string | null;
                transactionReference: string | null;
            }[];
        } & {
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
        };
    }>;
    getSummary(): Promise<{
        totalInvoiced: number;
        totalCollected: number;
        totalOutstanding: number;
        totalOverdue: number;
        counts: {
            total: number;
            paidCount: number;
            overdueCount: number;
            dueSoonCount: number;
            normalCount: number;
        };
    }>;
    findAll(query: FilterReceivableDto): Promise<{
        items: {
            overdueDays: number;
            agingStatus: string;
            customer: {
                id: number;
                email: string | null;
                phone: string | null;
                customerName: string;
                contactPerson: string | null;
            };
            contract: {
                id: number;
                contractCode: string;
                contractName: string;
            } | null;
            payments: {
                id: number;
                paymentDate: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
                paymentMethod: string | null;
            }[];
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
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(salesInvoiceId: number): Promise<{
        overdueDays: number;
        agingStatus: string;
        reminderHistory: ({
            reviewer: {
                id: number;
                email: string;
                fullName: string;
            } | null;
            emailLogs: {
                id: number;
                recipient: string;
                subject: string | null;
                content: string | null;
                sentAt: Date | null;
                errorMessage: string | null;
                approvalId: number | null;
                sendStatus: string;
            }[];
        } & {
            id: number;
            status: string;
            content: string | null;
            approvalType: string;
            referenceId: number | null;
            title: string;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            rejectionReason: string | null;
        })[];
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
        } | null;
        acceptanceRecord: {
            result: string;
            id: number;
            createdAt: Date;
            content: string | null;
            contractId: number;
            acceptanceCode: string;
            acceptanceDate: Date;
            issues: string | null;
            evidenceDocumentId: number | null;
        } | null;
        payments: {
            id: number;
            paymentStatus: string;
            createdAt: Date;
            note: string | null;
            salesInvoiceId: number;
            paymentDate: Date;
            amount: import("@prisma/client-runtime-utils").Decimal;
            paymentMethod: string | null;
            transactionReference: string | null;
        }[];
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
    }>;
    createReminderDraft(invoiceId: number, dto: CreateReminderDraftDto, userId?: number): Promise<{
        emailLogs: {
            id: number;
            recipient: string;
            subject: string | null;
            content: string | null;
            sentAt: Date | null;
            errorMessage: string | null;
            approvalId: number | null;
            sendStatus: string;
        }[];
    } & {
        id: number;
        status: string;
        content: string | null;
        approvalType: string;
        referenceId: number | null;
        title: string;
        reviewedBy: number | null;
        reviewedAt: Date | null;
        rejectionReason: string | null;
    }>;
    approveReminder(approvalId: number, dto: ApproveReminderDto, userId?: number): Promise<{
        success: boolean;
        approval: {
            id: number;
            status: string;
            content: string | null;
            approvalType: string;
            referenceId: number | null;
            title: string;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            rejectionReason: string | null;
        };
        message: string;
    }>;
    getReminderHistory(invoiceId: number): Promise<({
        reviewer: {
            id: number;
            email: string;
            fullName: string;
        } | null;
        emailLogs: {
            id: number;
            recipient: string;
            subject: string | null;
            content: string | null;
            sentAt: Date | null;
            errorMessage: string | null;
            approvalId: number | null;
            sendStatus: string;
        }[];
    } & {
        id: number;
        status: string;
        content: string | null;
        approvalType: string;
        referenceId: number | null;
        title: string;
        reviewedBy: number | null;
        reviewedAt: Date | null;
        rejectionReason: string | null;
    })[]>;
}
