var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayMinSize, IsArray, IsDateString, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested, } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuoteItemDto } from './create-quote-item.dto.js';
export class CreateQuoteDto {
    customerId;
    quotationCode;
    createdDate;
    validUntil;
    note;
    status = 'DRAFT';
    items;
}
__decorate([
    IsNotEmpty({ message: 'customerId không được để trống' }),
    Type(() => Number),
    IsInt({ message: 'customerId phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateQuoteDto.prototype, "customerId", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Mã báo giá phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "quotationCode", void 0);
__decorate([
    IsOptional(),
    IsDateString({}, { message: 'Ngày lập báo giá không đúng định dạng YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "createdDate", void 0);
__decorate([
    IsOptional(),
    IsDateString({}, { message: 'Ngày hết hạn báo giá không đúng định dạng YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "validUntil", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Ghi chú phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "note", void 0);
__decorate([
    IsOptional(),
    IsString(),
    IsIn(['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'], {
        message: 'Trạng thái không hợp lệ (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED)',
    }),
    __metadata("design:type", String)
], CreateQuoteDto.prototype, "status", void 0);
__decorate([
    IsNotEmpty({ message: 'Danh sách hạng mục báo giá (items) không được để trống' }),
    IsArray({ message: 'items phải là một danh sách' }),
    ArrayMinSize(1, { message: 'Báo giá phải có ít nhất 1 hạng mục dịch vụ' }),
    ValidateNested({ each: true }),
    Type(() => CreateQuoteItemDto),
    __metadata("design:type", Array)
], CreateQuoteDto.prototype, "items", void 0);
//# sourceMappingURL=create-quote.dto.js.map