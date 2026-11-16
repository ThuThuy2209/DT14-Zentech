import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { ServicesModule } from './modules/services/services.module.js';
import { QuotesModule } from './modules/quotes/quotes.module.js';
import { ContractsModule } from './modules/contracts/contracts.module.js';
import { AcceptanceModule } from './modules/acceptance/acceptance.module.js';
import { InvoicesModule } from './modules/invoices/invoices.module.js';
import { ReceivablesModule } from './modules/receivables/receivables.module.js';
import { ExpensesModule } from './modules/expenses/expenses.module.js';
import { BankAccountsModule } from './modules/bank-accounts/bank-accounts.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),

    // config module for environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    AuthModule,
    CustomersModule,
    ServicesModule,
    QuotesModule,
    ContractsModule,
    AcceptanceModule,
    InvoicesModule,
    ReceivablesModule,
    ExpensesModule,
    BankAccountsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
