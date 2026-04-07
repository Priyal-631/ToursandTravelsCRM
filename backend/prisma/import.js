import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function importCustomers() {
  const file = fs.readFileSync(path.resolve('./prisma/data/customers.csv'));
  const records = parse(file, {
    columns: true,        // use first row as keys
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Importing ${records.length} customers...`);

  for (const row of records) {
    await prisma.customer.create({
      data: {
        full_name: row.full_name,
        contact_number: row.contact_number || null,
        email_id: row.email_id || null,
        travel_destination: row.travel_destination || null,
        source_of_lead: row.source_of_lead || null,
        follow_up_status: row.follow_up_status || 'New',
      },
    });
  }

  console.log('Import complete!');
}

importCustomers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());