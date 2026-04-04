import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import pgPkg from '@prisma/adapter-pg';
const { PrismaPg } = pgPkg;

import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({ 
  adapter,
  log: ['error', 'warn']
})