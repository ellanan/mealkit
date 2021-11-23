import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    'info',
  ],
});

prisma.$on('query', async (e) => {
  console.log(`${e.query} ${e.params}`);
});
