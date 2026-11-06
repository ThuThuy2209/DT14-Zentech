import { ReceivablesService } from './receivables.service.js';
import { CreateReceivableDto } from './dto/create-receivable.dto.js';
import { UpdateReceivableDto } from './dto/update-receivable.dto.js';
export declare class ReceivablesController {
    private readonly receivablesService;
    constructor(receivablesService: ReceivablesService);
    create(createReceivableDto: CreateReceivableDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReceivableDto: UpdateReceivableDto): string;
    remove(id: string): string;
}
