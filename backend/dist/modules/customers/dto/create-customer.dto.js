var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength, } from 'class-validator';
export class CreateCustomerDto {
    customerName;
    taxCode;
    address;
    email;
    phone;
    contactPerson;
    status;
}
__decorate([
    IsNotEmpty({ message: 'Tên khách hàng không được để trống' }),
    IsString({ message: 'Tên khách hàng phải là chuỗi ký tự' }),
    MaxLength(255, { message: 'Tên khách hàng tối đa 255 ký tự' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "customerName", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Mã số thuế phải là chuỗi ký tự' }),
    MaxLength(50, { message: 'Mã số thuế tối đa 50 ký tự' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "taxCode", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Địa chỉ phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "address", void 0);
__decorate([
    IsOptional(),
    IsEmail({}, { message: 'Email khách hàng không đúng định dạng' }),
    MaxLength(150, { message: 'Email tối đa 150 ký tự' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Số điện thoại phải là chuỗi ký tự' }),
    MaxLength(30, { message: 'Số điện thoại tối đa 30 ký tự' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Người liên hệ phải là chuỗi ký tự' }),
    MaxLength(150, { message: 'Tên người liên hệ tối đa 150 ký tự' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "contactPerson", void 0);
__decorate([
    IsOptional(),
    IsString({ message: 'Trạng thái phải là chuỗi ký tự' }),
    IsIn(['ACTIVE', 'INACTIVE'], {
        message: 'Trạng thái chỉ có thể là ACTIVE hoặc INACTIVE',
    }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "status", void 0);
//# sourceMappingURL=create-customer.dto.js.map