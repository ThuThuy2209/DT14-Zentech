var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
let ContractsService = class ContractsService {
    create(createContractDto) {
        return 'This action adds a new contract';
    }
    findAll() {
        return `This action returns all contracts`;
    }
    findOne(id) {
        return `This action returns a #${id} contract`;
    }
    update(id, updateContractDto) {
        return `This action updates a #${id} contract`;
    }
    remove(id) {
        return `This action removes a #${id} contract`;
    }
};
ContractsService = __decorate([
    Injectable()
], ContractsService);
export { ContractsService };
//# sourceMappingURL=contracts.service.js.map