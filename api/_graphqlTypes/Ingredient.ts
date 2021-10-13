import { PrismaClient } from '@prisma/client';
import { objectType } from 'nexus';

const prisma = new PrismaClient();

export const Ingredient = objectType({
  name: 'Ingredient',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.field('type', {
      type: 'IngredientType',
      resolve: async (src) => {
        return await prisma.ingredientType.findUnique({
          where: {
            id: src.ingredientTypeId,
          },
        });
      },
    });
  },
});
