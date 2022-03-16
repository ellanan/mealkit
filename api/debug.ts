import type { Handler } from 'express';
import { prisma } from './_helpers/prismaClient';

const debugHandler: Handler = async (req, res) => {
  const cursor = req.query.cursor as string;
  console.log('debug:cursor', cursor);
  const results = await prisma.recipe.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
    take: 12,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  res.json(results);
};
export default debugHandler;
