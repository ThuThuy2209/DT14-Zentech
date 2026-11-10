import { CreateReceivableDto } from './dto/create-receivable.dto.js';
import { UpdateReceivableDto } from './dto/update-receivable.dto.js';
export declare class ReceivablesService {
    create(createReceivableDto: CreateReceivableDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateReceivableDto: UpdateReceivableDto): string;
    remove(id: number): string;
}
