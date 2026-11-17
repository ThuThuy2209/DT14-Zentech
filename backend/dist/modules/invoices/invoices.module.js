var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service.js';
import { InvoicesController } from './invoices.controller.js';
import { SalesInvoicesController } from './sales-invoices.controller.js';
import { SalesInvoicesService } from './sales-invoices.service.js';
import { PurchaseInvoicesController } from './purchase-invoices.controller.js';
import { PurchaseInvoicesService } from './purchase-invoices.service.js';
import { AiExtractionService } from './ai-extraction.service.js';
let InvoicesModule = class InvoicesModule {
};
InvoicesModule = __decorate([
    Module({
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
], InvoicesModule);
export { InvoicesModule };
//# sourceMappingURL=invoices.module.js.map