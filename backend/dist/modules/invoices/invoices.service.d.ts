import { CreateInvoiceDto } from './dto/create-invoice.dto.js';
import { UpdateInvoiceDto } from './dto/update-invoice.dto.js';
export declare class InvoicesService {
    create(createInvoiceDto: CreateInvoiceDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateInvoiceDto: UpdateInvoiceDto): string;
    remove(id: number): string;
}
