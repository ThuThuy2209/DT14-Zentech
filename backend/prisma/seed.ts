import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { seedUsersAndCompany } from './seeds/01-users-company.seed.js';
import { seedServices } from './seeds/02-services.seed.js';
import { seedBankAccounts } from './seeds/03-bank-accounts.seed.js';
import { seedCustomers } from './seeds/04-customers.seed.js';
import { seedQuotesAndContracts } from './seeds/05-quotes-contracts.seed.js';
import { seedInvoices } from './seeds/06-invoices.seed.js';
import { seedExpenses } from './seeds/07-expenses.seed.js';
import { seedLegalObligations } from './seeds/08-legal-obligations.seed.js';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Bat dau qua trinh nap du lieu mau (DT14 - OPC SmartOffice)');
  await seedUsersAndCompany(prisma);
  await seedServices(prisma);
  await seedBankAccounts(prisma);
  await seedCustomers(prisma);
  await seedQuotesAndContracts(prisma);
  await seedInvoices(prisma);
  await seedExpenses(prisma);
  await seedLegalObligations(prisma);

  console.log('Hoan thanh nap du lieu mau cho toan bo cac chuc nang!');
}

main()
  .catch((e) => {
    console.error('Loi trong qua trinh Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
