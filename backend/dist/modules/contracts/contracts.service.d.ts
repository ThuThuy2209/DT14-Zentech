import { CreateContractDto } from './dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto.js';
export declare class ContractsService {
    create(createContractDto: CreateContractDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateContractDto: UpdateContractDto): string;
    remove(id: number): string;
}
