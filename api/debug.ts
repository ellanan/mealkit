import type { Handler } from 'express';
import { prisma } from './_helpers/prismaClient';

const debugHandler: Handler = (req, res) => {
  const cursor = req.query.cursor as string;
  console.log('debug:cursor', cursor);
  prisma.recipe.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    take: 12,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });
};
export default debugHandler;
