import { Module } from '@nestjs/common';
import { BankStatementsService } from './bank-statements.service.js';
import { BankStatementsController } from './bank-statements.controller.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BankStatementsController],
  providers: [BankStatementsService],
  exports: [BankStatementsService],
})
export class BankStatementsModule {}
