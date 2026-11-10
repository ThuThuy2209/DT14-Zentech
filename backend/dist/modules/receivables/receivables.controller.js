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
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReceivablesService } from './receivables.service.js';
import { CreateReceivableDto } from './dto/create-receivable.dto.js';
import { UpdateReceivableDto } from './dto/update-receivable.dto.js';
let ReceivablesController = class ReceivablesController {
    receivablesService;
    constructor(receivablesService) {
        this.receivablesService = receivablesService;
    }
    create(createReceivableDto) {
        return this.receivablesService.create(createReceivableDto);
    }
    findAll() {
        return this.receivablesService.findAll();
    }
    findOne(id) {
        return this.receivablesService.findOne(+id);
    }
    update(id, updateReceivableDto) {
        return this.receivablesService.update(+id, updateReceivableDto);
    }
    remove(id) {
        return this.receivablesService.remove(+id);
    }
};
__decorate([
    Post(),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateReceivableDto]),
    __metadata("design:returntype", void 0)
], ReceivablesController.prototype, "create", null);
__decorate([
    Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReceivablesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReceivablesController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id')),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateReceivableDto]),
    __metadata("design:returntype", void 0)
], ReceivablesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReceivablesController.prototype, "remove", null);
ReceivablesController = __decorate([
    Controller('receivables'),
    __metadata("design:paramtypes", [ReceivablesService])
], ReceivablesController);
export { ReceivablesController };
//# sourceMappingURL=receivables.controller.js.map