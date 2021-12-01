import { PrismaClient } from '@prisma/client';
import { instanceId, logger } from './logger';

export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    'info',
  ],
});

logger.info(`${instanceId}: Prisma client initialized.`);

prisma.$on('query', async (e) => {
  console.log(`${e.query} ${e.params}`);
});

prisma.$on('beforeExit', async () => {
  logger.info(`${instanceId}: Prisma client disconnecting.`);
});
