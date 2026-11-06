import { ContractsService } from './contracts.service.js';
import { CreateContractDto } from './dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto.js';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    create(createContractDto: CreateContractDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateContractDto: UpdateContractDto): string;
    remove(id: string): string;
}
