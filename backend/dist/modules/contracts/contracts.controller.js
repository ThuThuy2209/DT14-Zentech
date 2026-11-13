var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards, } from '@nestjs/common';
import { ContractsService } from './contracts.service.js';
import { CreateContractDto } from './dto/create-contract.dto.js';
import { UpdateContractDto } from './dto/update-contract.dto.js';
import { FilterContractDto } from './dto/filter-contract.dto.js';
import { CreateTemplateDto } from './dto/create-template.dto.js';
import { AddSignerDto } from './dto/add-signer.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let ContractsController = class ContractsController {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    async getTemplates() {
        const data = await this.contractsService.getTemplates();
        return {
            success: true,
            message: 'Lấy danh sách mẫu hợp đồng thành công',
            data,
        };
    }
    async createTemplate(createTemplateDto) {
        const data = await this.contractsService.createTemplate(createTemplateDto);
        return {
            success: true,
            message: 'Tạo mẫu hợp đồng mới thành công',
            data,
        };
    }
    async create(createContractDto, user) {
        const data = await this.contractsService.create(createContractDto, user?.id);
        return {
            success: true,
            message: 'Tạo hợp đồng mới thành công',
            data,
        };
    }
    async findAll(query) {
        const data = await this.contractsService.findAll(query);
        return {
            success: true,
            message: 'Lấy danh sách hợp đồng thành công',
            data,
        };
    }
    async findOne(id) {
        const data = await this.contractsService.findOne(id);
        return {
            success: true,
            message: 'Lấy thông tin chi tiết hợp đồng thành công',
            data,
        };
    }
    async update(id, updateContractDto, user) {
        const data = await this.contractsService.update(id, updateContractDto, user?.id);
        return {
            success: true,
            message: 'Cập nhật hợp đồng thành công',
            data,
        };
    }
    async remove(id, user) {
        const result = await this.contractsService.remove(id, user?.id);
        return {
            success: true,
            message: result.message,
            data: null,
        };
    }
    async addSigner(id, addSignerDto) {
        const data = await this.contractsService.addSigner(id, addSignerDto);
        return {
            success: true,
            message: 'Thêm người ký vào hợp đồng thành công',
            data,
        };
    }
    async getSigners(id) {
        const data = await this.contractsService.getSigners(id);
        return {
            success: true,
            message: 'Lấy danh sách người ký thành công',
            data,
        };
    }
    async sendToSandboxSign(id, user) {
        const data = await this.contractsService.sendToSandboxSign(id, user?.id);
        return {
            success: true,
            message: data.message,
            data,
        };
    }
    async getSigningStatus(id) {
        const data = await this.contractsService.getSigningStatus(id);
        return {
            success: true,
            message: 'Lấy trạng thái ký số Sandbox thành công',
            data,
        };
    }
};
__decorate([
    Get('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getTemplates", null);
__decorate([
    Post('templates'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTemplateDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "createTemplate", null);
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterContractDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateContractDto, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "remove", null);
__decorate([
    Post(':id/signers'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, AddSignerDto]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "addSigner", null);
__decorate([
    Get(':id/signers'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getSigners", null);
__decorate([
    Post(':id/sign-sandbox'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "sendToSandboxSign", null);
__decorate([
    Get(':id/signing-status'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "getSigningStatus", null);
ContractsController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('contracts'),
    __metadata("design:paramtypes", [ContractsService])
], ContractsController);
export { ContractsController };
//# sourceMappingURL=contracts.controller.js.map