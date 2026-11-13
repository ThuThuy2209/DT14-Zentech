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
import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards, } from '@nestjs/common';
import { ReceivablesService } from './receivables.service.js';
import { RecordPaymentDto } from './dto/record-payment.dto.js';
import { FilterReceivableDto } from './dto/filter-receivable.dto.js';
import { CreateReminderDraftDto } from './dto/create-reminder-draft.dto.js';
import { ApproveReminderDto } from './dto/approve-reminder.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
let ReceivablesController = class ReceivablesController {
    receivablesService;
    constructor(receivablesService) {
        this.receivablesService = receivablesService;
    }
    async getSummary() {
        const data = await this.receivablesService.getSummary();
        return {
            success: true,
            message: 'Lấy báo cáo tổng hợp công nợ thành công',
            data,
        };
    }
    async recordPayment(recordPaymentDto, user) {
        const data = await this.receivablesService.recordPayment(recordPaymentDto, user?.id);
        return {
            success: true,
            message: 'Ghi nhận thanh toán thành công',
            data,
        };
    }
    async findAll(query) {
        const data = await this.receivablesService.findAll(query);
        return {
            success: true,
            message: 'Lấy danh sách công nợ thành công',
            data,
        };
    }
    async createReminderDraft(invoiceId, dto, user) {
        const data = await this.receivablesService.createReminderDraft(invoiceId, dto, user?.id);
        return {
            success: true,
            message: 'AI soạn nháp email nhắc nợ thành công',
            data,
        };
    }
    async approveReminder(approvalId, dto, user) {
        const data = await this.receivablesService.approveReminder(approvalId, dto, user?.id);
        return {
            success: true,
            message: data.message,
            data: data.approval,
        };
    }
    async getReminderHistory(invoiceId) {
        const data = await this.receivablesService.getReminderHistory(invoiceId);
        return {
            success: true,
            message: 'Lấy lịch sử nhắc nợ thành công',
            data,
        };
    }
    async findOne(invoiceId) {
        const data = await this.receivablesService.findOne(invoiceId);
        return {
            success: true,
            message: 'Lấy thông tin công nợ chi tiết thành công',
            data,
        };
    }
};
__decorate([
    Get('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "getSummary", null);
__decorate([
    Post('payments'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RecordPaymentDto, Object]),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "recordPayment", null);
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterReceivableDto]),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "findAll", null);
__decorate([
    Post(':invoiceId/remind-draft'),
    HttpCode(HttpStatus.CREATED),
    __param(0, Param('invoiceId', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CreateReminderDraftDto, Object]),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "createReminderDraft", null);
__decorate([
    Post('remind-approve/:approvalId'),
    __param(0, Param('approvalId', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ApproveReminderDto, Object]),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "approveReminder", null);
__decorate([
    Get(':invoiceId/reminder-history'),
    __param(0, Param('invoiceId', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "getReminderHistory", null);
__decorate([
    Get(':invoiceId'),
    __param(0, Param('invoiceId', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReceivablesController.prototype, "findOne", null);
ReceivablesController = __decorate([
    UseGuards(JwtAuthGuard),
    Controller('receivables'),
    __metadata("design:paramtypes", [ReceivablesService])
], ReceivablesController);
export { ReceivablesController };
//# sourceMappingURL=receivables.controller.js.map