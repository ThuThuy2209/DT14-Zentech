import { CreateQuoteItemDto } from './create-quote-item.dto.js';
export declare class CreateQuoteDto {
    customerId: number;
    quotationCode?: string;
    createdDate?: string;
    validUntil?: string;
    note?: string;
    status?: string;
    items: CreateQuoteItemDto[];
}
