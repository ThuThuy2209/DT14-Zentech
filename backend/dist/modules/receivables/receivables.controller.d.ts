import { ReceivablesService } from './receivables.service.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { FilterReceivableDto } from './dto/filter-receivable.dto.js';
import { CreateReminderDraftDto } from './dto/create-reminder-draft.dto.js';
import { ApproveReminderDto } from './dto/approve-reminder.dto.js';
export declare class ReceivablesController {
    private readonly receivablesService;
    constructor(receivablesService: ReceivablesService);
    getSummary(): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    recordPayment(recordPaymentDto: RecordPaymentDto, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            payment: {
                id: number;
                salesInvoiceId: number;
                paymentDate: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
                paymentMethod: string | null;
                transactionReference: string | null;
                paymentStatus: string;
                note: string | null;
                createdAt: Date;
            };
            invoice: {
                customer: {
                    id: number;
                    createdAt: Date;
                    customerName: string;
                    taxCode: string | null;
                    address: string | null;
                    email: string | null;
                    phone: string | null;
                    contactPerson: string | null;
                    status: string;
                };
                payments: {
                    id: number;
                    salesInvoiceId: number;
                    paymentDate: Date;
                    amount: import("@prisma/client-runtime-utils").Decimal;
                    paymentMethod: string | null;
                    transactionReference: string | null;
                    paymentStatus: string;
                    note: string | null;
                    createdAt: Date;
                }[];
            } & {
                id: number;
                paymentStatus: string;
                createdAt: Date;
                invoiceNumber: string;
                customerId: number;
                contractId: number | null;
                acceptanceId: number | null;
                invoiceDate: Date;
                dueDate: Date | null;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                totalAmount: import("@prisma/client-runtime-utils").Decimal;
                invoiceStatus: string;
                documentId: number | null;
                outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
                paidAmount: import("@prisma/client-runtime-utils").Decimal;
                issueDate: Date | null;
                updatedAt: Date;
            };
        };
    }>;
    findAll(query: FilterReceivableDto): Promise<{
        success: boolean;
        message: string;
        data: {
            items: {
                overdueDays: number;
                agingStatus: string;
                customer: {
                    id: number;
                    customerName: string;
                    email: string | null;
                    phone: string | null;
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
                id: number;
                paymentStatus: string;
                createdAt: Date;
                invoiceNumber: string;
                customerId: number;
                contractId: number | null;
                acceptanceId: number | null;
                invoiceDate: Date;
                dueDate: Date | null;
                subtotal: import("@prisma/client-runtime-utils").Decimal;
                taxAmount: import("@prisma/client-runtime-utils").Decimal;
                totalAmount: import("@prisma/client-runtime-utils").Decimal;
                invoiceStatus: string;
                documentId: number | null;
                outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
                paidAmount: import("@prisma/client-runtime-utils").Decimal;
                issueDate: Date | null;
                updatedAt: Date;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createReminderDraft(invoiceId: number, dto: CreateReminderDraftDto, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            emailLogs: {
                id: number;
                content: string | null;
                approvalId: number | null;
                recipient: string;
                subject: string | null;
                sentAt: Date | null;
                sendStatus: string;
                errorMessage: string | null;
            }[];
        } & {
            id: number;
            status: string;
            approvalType: string;
            referenceId: number | null;
            title: string;
            content: string | null;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            rejectionReason: string | null;
        };
    }>;
    approveReminder(approvalId: number, dto: ApproveReminderDto, user: {
        id: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            status: string;
            approvalType: string;
            referenceId: number | null;
            title: string;
            content: string | null;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            rejectionReason: string | null;
        };
    }>;
    getReminderHistory(invoiceId: number): Promise<{
        success: boolean;
        message: string;
        data: ({
            reviewer: {
                id: number;
                email: string;
                fullName: string;
            } | null;
            emailLogs: {
                id: number;
                content: string | null;
                approvalId: number | null;
                recipient: string;
                subject: string | null;
                sentAt: Date | null;
                sendStatus: string;
                errorMessage: string | null;
            }[];
        } & {
            id: number;
            status: string;
            approvalType: string;
            referenceId: number | null;
            title: string;
            content: string | null;
            reviewedBy: number | null;
            reviewedAt: Date | null;
            rejectionReason: string | null;
        })[];
    }>;
    findOne(invoiceId: number): Promise<{
        success: boolean;
        message: string;
        data: {
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
                    content: string | null;
                    approvalId: number | null;
                    recipient: string;
                    subject: string | null;
                    sentAt: Date | null;
                    sendStatus: string;
                    errorMessage: string | null;
                }[];
            } & {
                id: number;
                status: string;
                approvalType: string;
                referenceId: number | null;
                title: string;
                content: string | null;
                reviewedBy: number | null;
                reviewedAt: Date | null;
                rejectionReason: string | null;
            })[];
            customer: {
                id: number;
                createdAt: Date;
                customerName: string;
                taxCode: string | null;
                address: string | null;
                email: string | null;
                phone: string | null;
                contactPerson: string | null;
                status: string;
            };
            contract: {
                id: number;
                createdAt: Date;
                customerId: number;
                documentId: number | null;
                status: string;
                contractCode: string;
                quotationId: number | null;
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
                contractId: number;
                content: string | null;
                acceptanceCode: string;
                acceptanceDate: Date;
                issues: string | null;
                evidenceDocumentId: number | null;
            } | null;
            payments: {
                id: number;
                salesInvoiceId: number;
                paymentDate: Date;
                amount: import("@prisma/client-runtime-utils").Decimal;
                paymentMethod: string | null;
                transactionReference: string | null;
                paymentStatus: string;
                note: string | null;
                createdAt: Date;
            }[];
            id: number;
            paymentStatus: string;
            createdAt: Date;
            invoiceNumber: string;
            customerId: number;
            contractId: number | null;
            acceptanceId: number | null;
            invoiceDate: Date;
            dueDate: Date | null;
            subtotal: import("@prisma/client-runtime-utils").Decimal;
            taxAmount: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            invoiceStatus: string;
            documentId: number | null;
            outstandingAmount: import("@prisma/client-runtime-utils").Decimal;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            issueDate: Date | null;
            updatedAt: Date;
        };
    }>;
}
