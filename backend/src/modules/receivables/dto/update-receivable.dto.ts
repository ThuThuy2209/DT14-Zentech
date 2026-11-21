import { PartialType } from '@nestjs/swagger';
import { CreateReceivableDto } from './create-receivable.dto.js';

export class UpdateReceivableDto extends PartialType(CreateReceivableDto) {}
