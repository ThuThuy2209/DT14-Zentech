import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service.js';
import { InvoicesController } from './invoices.controller.js';
import { SalesInvoicesController } from './sales-invoices.controller.js';
import { SalesInvoicesService } from './sales-invoices.service.js';
import { PurchaseInvoicesController } from './purchase-invoices.controller.js';
import { PurchaseInvoicesService } from './purchase-invoices.service.js';
import { AiExtractionService } from './ai-extraction.service.js';

@Module({
  controllers: [
    InvoicesController,
    SalesInvoicesController,
    PurchaseInvoicesController,
  ],
  providers: [
    InvoicesService,
    SalesInvoicesService,
    PurchaseInvoicesService,
    AiExtractionService,
  ],
  exports: [
    InvoicesService,
    SalesInvoicesService,
    PurchaseInvoicesService,
    AiExtractionService,
  ],
})
export class InvoicesModule {}
