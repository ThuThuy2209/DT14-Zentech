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
import { QuotesService } from './quotes.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { FilterQuoteDto } from './dto/filter-quote.dto.js';
import { UpdateQuoteStatusDto } from './dto/update-quote-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let QuotesController = class QuotesController {
    quotesService;
    constructor(quotesService) {
        this.quotesService = quotesService;
    }
    async getServices() {
        const data = await this.quotesService.getServices();
        return {
            success: true,
            message: 'Lấy danh mục dịch vụ mẫu thành công',
            data,
        };
    }
    async create(createQuoteDto, user) {
        const data = await this.quotesService.create(createQuoteDto, user?.id);
        return {
            success: true,
            message: 'Tạo báo giá mới thành công',
            data,
        };
    }
    async findAll(query) {
        const data = await this.quotesService.findAll(query);
        return {
            success: true,
            message: 'Lấy danh sách báo giá thành công',
            data,
        };
    }
    async findOne(id) {
        const data = await this.quotesService.findOne(id);
        return {
            success: true,
            message: 'Lấy thông tin chi tiết báo giá thành công',
            data,
        };
    }
    async getHistory(id) {
        const data = await this.quotesService.getHistory(id);
        return {
            success: true,
            message: 'Lấy lịch sử báo giá thành công',
            data,
        };
    }
    async sendQuote(id, user) {
        const data = await this.quotesService.sendQuote(id, user?.id);
        return {
            success: true,
            message: `Đã gửi email báo giá thành công tới ${data.recipient}`,
            data,
        };
    }
    async convertToContract(id, user) {
        const data = await this.quotesService.convertToContract(id, user?.id);
        return {
            success: true,
            message: `Chuyển báo giá thành Hợp đồng ${data.contractCode} thành công!`,
            data,
        };
    }
    async update(id, updateQuoteDto, user) {
        const data = await this.quotesService.update(id, updateQuoteDto, user?.id);
        return {
            success: true,
            message: 'Cập nhật báo giá thành công',
            data,
        };
    }
    async updateStatus(id, updateQuoteStatusDto, user) {
        const data = await this.quotesService.updateStatus(id, updateQuoteStatusDto, user?.id);
        return {
            success: true,
            message: 'Cập nhật trạng thái báo giá thành công',
            data,
        };
    }
    async remove(id, user) {
        const result = await this.quotesService.remove(id, user?.id);
        return {
            success: true,
            message: result.message,
            data: null,
        };
    }
};
__decorate([
    Get('services'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "getServices", null);
__decorate([
    Post(),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateQuoteDto, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterQuoteDto]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "findOne", null);
__decorate([
    Get(':id/history'),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "getHistory", null);
__decorate([
    Post(':id/send'),
    HttpCode(HttpStatus.OK),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "sendQuote", null);
__decorate([
    Post(':id/convert-to-contract'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "convertToContract", null);
__decorate([
    Patch(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateQuoteDto, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "update", null);
__decorate([
    Patch(':id/status'),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UpdateQuoteStatusDto, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "updateStatus", null);
__decorate([
    Delete(':id'),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QuotesController.prototype, "remove", null);
QuotesController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('quotes'),
    __metadata("design:paramtypes", [QuotesService])
], QuotesController);
export { QuotesController };
//# sourceMappingURL=quotes.controller.js.map