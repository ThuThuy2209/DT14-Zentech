var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateContractDto {
    customerId;
    contractName;
    contractCode;
    quotationId;
    templateVersionId;
    contractValue;
    startDate;
    endDate;
    contractContent;
    status = 'DRAFT';
}
__decorate([
    IsNotEmpty({ message: 'customerId không được để trống' }),
    Type(() => Number),
    IsInt({ message: 'customerId phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "customerId", void 0);
__decorate([
    IsNotEmpty({ message: 'Tên hợp đồng không được để trống' }),
    IsString({ message: 'Tên hợp đồng phải là chuỗi' }),
    MaxLength(255, { message: 'Tên hợp đồng tối đa 255 ký tự' }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "contractName", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Mã hợp đồng phải là chuỗi' }),
    MaxLength(50, { message: 'Mã hợp đồng tối đa 50 ký tự' }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "contractCode", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt({ message: 'quotationId phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "quotationId", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsInt({ message: 'templateVersionId phải là số nguyên' }),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "templateVersionId", void 0);
__decorate([
    IsNotEmpty({ message: 'Giá trị hợp đồng không được để trống' }),
    Type(() => Number),
    IsNumber({}, { message: 'Giá trị hợp đồng phải là số' }),
    IsPositive({ message: 'Giá trị hợp đồng phải lớn hơn 0' }),
    __metadata("design:type", Number)
], CreateContractDto.prototype, "contractValue", void 0);
__decorate([
    IsOptional(),
    IsDateString({}, { message: 'Ngày bắt đầu hợp đồng không đúng định dạng YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "startDate", void 0);
__decorate([
    IsOptional(),
    IsDateString({}, { message: 'Ngày kết thúc hợp đồng không đúng định dạng YYYY-MM-DD' }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "endDate", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Nội dung hợp đồng phải là chuỗi' }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "contractContent", void 0);
__decorate([
    IsOptional(),
    IsString(),
    IsIn([
        'DRAFT',
        'PENDING_SIGN',
        'SIGNING',
        'SIGNED',
        'REJECTED',
        'EXPIRED',
        'TERMINATED',
    ], {
        message: 'Trạng thái hợp đồng chỉ có thể là: DRAFT, PENDING_SIGN, SIGNING, SIGNED, REJECTED, EXPIRED, TERMINATED',
    }),
    __metadata("design:type", String)
], CreateContractDto.prototype, "status", void 0);
//# sourceMappingURL=create-contract.dto.js.map