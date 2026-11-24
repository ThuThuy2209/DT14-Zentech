import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';

// Controllers
import { BankAccountsController } from './controllers/bank-accounts.controller.js';
import { BankStatementsController } from './controllers/bank-statements.controller.js';
import { BankTransactionsController } from './controllers/bank-transactions.controller.js';
import { BankReconciliationsController } from './controllers/bank-reconciliations.controller.js';

// Services
import { BankAccountsService } from './services/bank-accounts.service.js';
import { BankStatementsService } from './services/bank-statements.service.js';
import { BankTransactionsService } from './services/bank-transactions.service.js';
import { BankReconciliationsService } from './services/bank-reconciliations.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    BankAccountsController,
    BankStatementsController,
    BankTransactionsController,
    BankReconciliationsController,
  ],
  providers: [
    BankAccountsService,
    BankStatementsService,
    BankTransactionsService,
    BankReconciliationsService,
  ],
  exports: [
    BankAccountsService,
    BankStatementsService,
    BankTransactionsService,
    BankReconciliationsService,
  ],
})
export class BankModule {}
