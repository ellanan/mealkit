import { PrismaClient } from '@prisma/client';
import { objectType } from 'nexus';

const prisma = new PrismaClient();

export const MealPlan = objectType({
  name: 'MealPlan',
  definition(t) {
    t.nonNull.id('id');
  },
});
