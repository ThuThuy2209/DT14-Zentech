import { Module } from '@nestjs/common';
import { AcceptanceService } from './acceptance.service.js';
import { AcceptanceController } from './acceptance.controller.js';

@Module({
  controllers: [AcceptanceController],
  providers: [AcceptanceService],
  exports: [AcceptanceService],
})
export class AcceptanceModule {}
