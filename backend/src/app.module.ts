import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { QuotesModule } from './modules/quotes/quotes.module.js';
import { ContractsModule } from './modules/contracts/contracts.module.js';
import { InvoicesModule } from './modules/invoices/invoices.module.js';
import { ReceivablesModule } from './modules/receivables/receivables.module.js';
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

    CustomersModule,
    QuotesModule,
    ContractsModule,
    InvoicesModule,
    ReceivablesModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
