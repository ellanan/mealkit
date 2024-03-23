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

try {
  // prisma data proxy doesn't seem to support beforeExit yet
  // this throws "ERROR	NotImplementedYetError: beforeExit event is not yet supported"
  prisma.$on('beforeExit', async () => {
    logger.info(`${instanceId}: Prisma client disconnecting.`);
  });
} catch (e) {
  console.log(e);
}
