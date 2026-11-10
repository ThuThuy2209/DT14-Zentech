import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { CustomersModule } from './modules/customers/customers.module.js';
import { QuotesModule } from './modules/quotes/quotes.module.js';
import { ContractsModule } from './modules/contracts/contracts.module.js';
import { InvoicesModule } from './modules/invoices/invoices.module.js';
import { ReceivablesModule } from './modules/receivables/receivables.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    CustomersModule,
    QuotesModule,
    ContractsModule,
    InvoicesModule,
    ReceivablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
