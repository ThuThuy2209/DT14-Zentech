var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let InvoicesService = class InvoicesService {
    create(createInvoiceDto) {
        return 'This action adds a new invoice';
    }
    findAll() {
        return `This action returns all invoices`;
    }
    findOne(id) {
        return `This action returns a #${id} invoice`;
    }
    update(id, updateInvoiceDto) {
        return `This action updates a #${id} invoice`;
    }
    remove(id) {
        return `This action removes a #${id} invoice`;
    }
};
InvoicesService = __decorate([
    Injectable()
], InvoicesService);
export { InvoicesService };
//# sourceMappingURL=invoices.service.js.map