import { Module } from '@nestjs/common';
import { BankReconciliationsService } from './bank-reconciliations.service.js';
import { BankReconciliationsController } from './bank-reconciliations.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BankReconciliationsController],
  providers: [BankReconciliationsService],
  exports: [BankReconciliationsService],
})
export class BankReconciliationsModule {}
