var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
export const { ObserveModule, ObserveInstrument } = createObserveModule();
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ObserveModule.forRoot({
                appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
                appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
                serviceId: 'backend',
            }),
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
            PrismaModule,
        ],
        controllers: [AppController],
        providers: [AppService],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map