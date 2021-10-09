import { PrismaClient } from '@prisma/client';
import { objectType } from 'nexus';

const prisma = new PrismaClient();

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.string('username');
    t.string('email');
    t.nonNull.list.field('recipes', {
      type: 'Recipe',
      async resolve(parent) {
        const userId = parent.id;
        return prisma.recipe.findMany({
          where: {
            user: {
              is: {
                id: userId,
              },
            },
          },
        });
      },
    });
  },
});
