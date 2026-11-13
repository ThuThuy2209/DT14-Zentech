import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service.js';
import { InvoicesController } from './invoices.controller.js';
import { SalesInvoicesController } from './sales-invoices.controller.js';
import { SalesInvoicesService } from './sales-invoices.service.js';

@Module({
  controllers: [InvoicesController, SalesInvoicesController],
  providers: [InvoicesService, SalesInvoicesService],
  exports: [InvoicesService, SalesInvoicesService],
})
export class InvoicesModule {}
