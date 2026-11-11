-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "full_name" VARCHAR(150) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "companies" (
    "company_id" SERIAL NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "tax_code" VARCHAR(50) NOT NULL,
    "address" TEXT,
    "email" VARCHAR(150),
    "phone" VARCHAR(30),
    "representative" VARCHAR(150),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "customers" (
    "customer_id" SERIAL NOT NULL,
    "customer_name" VARCHAR(255) NOT NULL,
    "tax_code" VARCHAR(50),
    "address" TEXT,
    "email" VARCHAR(150),
    "phone" VARCHAR(30),
    "contact_person" VARCHAR(150),
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "services" (
    "service_id" SERIAL NOT NULL,
    "service_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "unit" VARCHAR(50),
    "unit_price" DECIMAL(15,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "email_accounts" (
    "email_account_id" SERIAL NOT NULL,
    "email_address" VARCHAR(150) NOT NULL,
    "provider" VARCHAR(100) NOT NULL,
    "connection_status" VARCHAR(30) NOT NULL,
    "credential_reference" VARCHAR(255),
    "last_sync_at" TIMESTAMP(3),

    CONSTRAINT "email_accounts_pkey" PRIMARY KEY ("email_account_id")
);

-- CreateTable
CREATE TABLE "email_messages" (
    "email_message_id" SERIAL NOT NULL,
    "email_account_id" INTEGER NOT NULL,
    "external_message_id" VARCHAR(255),
    "sender" VARCHAR(255) NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500),
    "body" TEXT,
    "received_at" TIMESTAMP(3) NOT NULL,
    "category" VARCHAR(50),
    "sync_status" VARCHAR(30) NOT NULL,

    CONSTRAINT "email_messages_pkey" PRIMARY KEY ("email_message_id")
);

-- CreateTable
CREATE TABLE "email_attachments" (
    "attachment_id" SERIAL NOT NULL,
    "email_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_type" VARCHAR(100),
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_attachments_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "documents" (
    "document_id" SERIAL NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "file_path" VARCHAR(500) NOT NULL,
    "file_type" VARCHAR(50),
    "file_size" BIGINT,
    "document_type" VARCHAR(50),
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" INTEGER,
    "email_message_id" INTEGER,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "purchase_invoices" (
    "purchase_invoice_id" SERIAL NOT NULL,
    "supplier_name" VARCHAR(200) NOT NULL,
    "email_message_id" INTEGER,
    "invoice_number" VARCHAR(100),
    "seller_tax_code" VARCHAR(50),
    "buyer_tax_code" VARCHAR(50),
    "invoice_date" DATE,
    "due_date" DATE,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "paid_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "outstanding_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "duplicate_status" VARCHAR(30),
    "buyer_tax_status" VARCHAR(30),
    "ocr_status" VARCHAR(30),
    "payment_status" VARCHAR(30),
    "document_id" INTEGER,

    CONSTRAINT "purchase_invoices_pkey" PRIMARY KEY ("purchase_invoice_id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "quotation_id" SERIAL NOT NULL,
    "quotation_code" VARCHAR(50) NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "created_date" DATE NOT NULL,
    "valid_until" DATE,
    "subtotal" DECIMAL(15,2) NOT NULL,
    "discount_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "note" TEXT,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("quotation_id")
);

-- CreateTable
CREATE TABLE "quotation_items" (
    "quotation_item_id" SERIAL NOT NULL,
    "quotation_id" INTEGER NOT NULL,
    "service_id" INTEGER,
    "description" TEXT,
    "quantity" DECIMAL(12,2) NOT NULL,
    "unit_price" DECIMAL(15,2) NOT NULL,
    "discount_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax_rate" DECIMAL(5,2),
    "line_total" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "quotation_items_pkey" PRIMARY KEY ("quotation_item_id")
);

-- CreateTable
CREATE TABLE "contract_templates" (
    "template_id" SERIAL NOT NULL,
    "template_name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_templates_pkey" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "contract_template_versions" (
    "template_version_id" SERIAL NOT NULL,
    "template_id" INTEGER NOT NULL,
    "version_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "placeholder_config" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_template_versions_pkey" PRIMARY KEY ("template_version_id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "contract_id" SERIAL NOT NULL,
    "contract_code" VARCHAR(50) NOT NULL,
    "quotation_id" INTEGER,
    "customer_id" INTEGER NOT NULL,
    "template_version_id" INTEGER,
    "contract_name" VARCHAR(255) NOT NULL,
    "contract_value" DECIMAL(15,2) NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "contract_content" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "document_id" INTEGER,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("contract_id")
);

-- CreateTable
CREATE TABLE "contract_signers" (
    "signer_id" SERIAL NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "signer_name" VARCHAR(255) NOT NULL,
    "signer_email" VARCHAR(150) NOT NULL,
    "signer_role" VARCHAR(100),
    "signing_order" INTEGER,
    "signing_status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "contract_signers_pkey" PRIMARY KEY ("signer_id")
);

-- CreateTable
CREATE TABLE "contract_signature_requests" (
    "signature_request_id" SERIAL NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "transaction_id" VARCHAR(255),
    "request_status" VARCHAR(30) NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,
    "signed_document_id" INTEGER,

    CONSTRAINT "contract_signature_requests_pkey" PRIMARY KEY ("signature_request_id")
);

-- CreateTable
CREATE TABLE "contract_sign_events" (
    "sign_event_id" SERIAL NOT NULL,
    "signature_request_id" INTEGER NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "event_status" VARCHAR(30) NOT NULL,
    "event_message" TEXT,
    "event_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contract_sign_events_pkey" PRIMARY KEY ("sign_event_id")
);

-- CreateTable
CREATE TABLE "acceptance_records" (
    "acceptance_id" SERIAL NOT NULL,
    "contract_id" INTEGER NOT NULL,
    "acceptance_code" VARCHAR(50) NOT NULL,
    "acceptance_date" DATE NOT NULL,
    "content" TEXT,
    "result" VARCHAR(30) NOT NULL,
    "issues" TEXT,
    "evidence_document_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "acceptance_records_pkey" PRIMARY KEY ("acceptance_id")
);

-- CreateTable
CREATE TABLE "sales_invoices" (
    "sales_invoice_id" SERIAL NOT NULL,
    "invoice_number" VARCHAR(100) NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "contract_id" INTEGER,
    "acceptance_id" INTEGER,
    "invoice_date" DATE NOT NULL,
    "due_date" DATE,
    "subtotal" DECIMAL(15,2) NOT NULL,
    "tax_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "invoice_status" VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    "document_id" INTEGER,
    "outstanding_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "payment_status" VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    "paid_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "issue_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_invoices_pkey" PRIMARY KEY ("sales_invoice_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "sales_invoice_id" INTEGER NOT NULL,
    "payment_date" DATE NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "payment_method" VARCHAR(50),
    "transaction_reference" VARCHAR(100),
    "payment_status" VARCHAR(30) NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "account_id" SERIAL NOT NULL,
    "bank_name" VARCHAR(150) NOT NULL,
    "account_number" VARCHAR(50) NOT NULL,
    "account_holder" VARCHAR(150) NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'VND',
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "bank_statements" (
    "statement_id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "imported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imported_by" INTEGER,
    "file_hash" VARCHAR(255),
    "import_status" VARCHAR(30) NOT NULL,

    CONSTRAINT "bank_statements_pkey" PRIMARY KEY ("statement_id")
);

-- CreateTable
CREATE TABLE "bank_transactions" (
    "transaction_id" SERIAL NOT NULL,
    "statement_id" INTEGER NOT NULL,
    "external_transaction_id" VARCHAR(100),
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "debit_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "credit_amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "balance_after" DECIMAL(18,2),
    "reference_code" VARCHAR(100),
    "duplicate_status" VARCHAR(30),
    "reconciliation_status" VARCHAR(30) NOT NULL DEFAULT 'UNRECONCILED',

    CONSTRAINT "bank_transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "bank_reconciliations" (
    "reconciliation_id" SERIAL NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "sales_invoice_id" INTEGER,
    "purchase_invoice_id" INTEGER,
    "expense_id" INTEGER,
    "matched_amount" DECIMAL(18,2) NOT NULL,
    "match_status" VARCHAR(30) NOT NULL,
    "confirmed_by" INTEGER,
    "confirmed_at" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "bank_reconciliations_pkey" PRIMARY KEY ("reconciliation_id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "expense_id" SERIAL NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(18,2) NOT NULL,
    "expense_date" DATE NOT NULL,
    "due_date" DATE,
    "status" VARCHAR(30) NOT NULL,
    "document_id" INTEGER,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("expense_id")
);

-- CreateTable
CREATE TABLE "legal_obligation_types" (
    "obligation_type_id" SERIAL NOT NULL,
    "type_name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "occurrence_type" VARCHAR(30),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "legal_obligation_types_pkey" PRIMARY KEY ("obligation_type_id")
);

-- CreateTable
CREATE TABLE "legal_obligations" (
    "obligation_id" SERIAL NOT NULL,
    "obligation_name" VARCHAR(255) NOT NULL,
    "obligation_type" VARCHAR(50),
    "frequency_type" VARCHAR(30),
    "description" TEXT,
    "legal_basis" TEXT,
    "source_url" VARCHAR(500),
    "applicability" VARCHAR(30) DEFAULT 'APPLICABLE',
    "status" VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "legal_obligations_pkey" PRIMARY KEY ("obligation_id")
);

-- CreateTable
CREATE TABLE "legal_obligation_periods" (
    "obligation_period_id" SERIAL NOT NULL,
    "obligation_id" INTEGER NOT NULL,
    "period_name" VARCHAR(100) NOT NULL,
    "start_date" DATE,
    "due_date" DATE NOT NULL,
    "completed_date" DATE,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "evidence_document_id" INTEGER,
    "note" TEXT,

    CONSTRAINT "legal_obligation_periods_pkey" PRIMARY KEY ("obligation_period_id")
);

-- CreateTable
CREATE TABLE "approval_requests" (
    "approval_id" SERIAL NOT NULL,
    "approval_type" VARCHAR(50) NOT NULL,
    "reference_id" INTEGER,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "reviewed_by" INTEGER,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,

    CONSTRAINT "approval_requests_pkey" PRIMARY KEY ("approval_id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "email_log_id" SERIAL NOT NULL,
    "approval_id" INTEGER,
    "recipient" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500),
    "content" TEXT,
    "sent_at" TIMESTAMP(3),
    "send_status" VARCHAR(30) NOT NULL,
    "error_message" TEXT,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("email_log_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "notification_type" VARCHAR(50),
    "reference_id" INTEGER,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "activity_log_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "action" VARCHAR(100) NOT NULL,
    "entity_type" VARCHAR(100),
    "entity_id" INTEGER,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("activity_log_id")
);

-- CreateTable
CREATE TABLE "ai_interactions" (
    "ai_interaction_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "interaction_type" VARCHAR(50),
    "input_content" TEXT,
    "output_content" TEXT,
    "source_reference" TEXT,
    "status" VARCHAR(30) NOT NULL DEFAULT 'SUCCESS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_interactions_pkey" PRIMARY KEY ("ai_interaction_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_quotation_code_key" ON "quotations"("quotation_code");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contract_code_key" ON "contracts"("contract_code");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_quotation_id_key" ON "contracts"("quotation_id");

-- CreateIndex
CREATE UNIQUE INDEX "acceptance_records_acceptance_code_key" ON "acceptance_records"("acceptance_code");

-- CreateIndex
CREATE UNIQUE INDEX "sales_invoices_invoice_number_key" ON "sales_invoices"("invoice_number");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_account_number_key" ON "bank_accounts"("account_number");

-- AddForeignKey
ALTER TABLE "email_messages" ADD CONSTRAINT "email_messages_email_account_id_fkey" FOREIGN KEY ("email_account_id") REFERENCES "email_accounts"("email_account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_attachments" ADD CONSTRAINT "email_attachments_email_id_fkey" FOREIGN KEY ("email_id") REFERENCES "email_messages"("email_message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_email_message_id_fkey" FOREIGN KEY ("email_message_id") REFERENCES "email_messages"("email_message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_email_message_id_fkey" FOREIGN KEY ("email_message_id") REFERENCES "email_messages"("email_message_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_invoices" ADD CONSTRAINT "purchase_invoices_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("quotation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_items" ADD CONSTRAINT "quotation_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("service_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_template_versions" ADD CONSTRAINT "contract_template_versions_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "contract_templates"("template_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_quotation_id_fkey" FOREIGN KEY ("quotation_id") REFERENCES "quotations"("quotation_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_template_version_id_fkey" FOREIGN KEY ("template_version_id") REFERENCES "contract_template_versions"("template_version_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_signers" ADD CONSTRAINT "contract_signers_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_signature_requests" ADD CONSTRAINT "contract_signature_requests_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_signature_requests" ADD CONSTRAINT "contract_signature_requests_signed_document_id_fkey" FOREIGN KEY ("signed_document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_sign_events" ADD CONSTRAINT "contract_sign_events_signature_request_id_fkey" FOREIGN KEY ("signature_request_id") REFERENCES "contract_signature_requests"("signature_request_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_records" ADD CONSTRAINT "acceptance_records_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "acceptance_records" ADD CONSTRAINT "acceptance_records_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "contracts"("contract_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_acceptance_id_fkey" FOREIGN KEY ("acceptance_id") REFERENCES "acceptance_records"("acceptance_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sales_invoices" ADD CONSTRAINT "sales_invoices_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_sales_invoice_id_fkey" FOREIGN KEY ("sales_invoice_id") REFERENCES "sales_invoices"("sales_invoice_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "bank_accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_statements" ADD CONSTRAINT "bank_statements_imported_by_fkey" FOREIGN KEY ("imported_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_transactions" ADD CONSTRAINT "bank_transactions_statement_id_fkey" FOREIGN KEY ("statement_id") REFERENCES "bank_statements"("statement_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "bank_transactions"("transaction_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_sales_invoice_id_fkey" FOREIGN KEY ("sales_invoice_id") REFERENCES "sales_invoices"("sales_invoice_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_purchase_invoice_id_fkey" FOREIGN KEY ("purchase_invoice_id") REFERENCES "purchase_invoices"("purchase_invoice_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("expense_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_reconciliations" ADD CONSTRAINT "bank_reconciliations_confirmed_by_fkey" FOREIGN KEY ("confirmed_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_obligation_periods" ADD CONSTRAINT "legal_obligation_periods_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "legal_obligations"("obligation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "legal_obligation_periods" ADD CONSTRAINT "legal_obligation_periods_evidence_document_id_fkey" FOREIGN KEY ("evidence_document_id") REFERENCES "documents"("document_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approval_requests" ADD CONSTRAINT "approval_requests_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_logs" ADD CONSTRAINT "email_logs_approval_id_fkey" FOREIGN KEY ("approval_id") REFERENCES "approval_requests"("approval_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_interactions" ADD CONSTRAINT "ai_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
