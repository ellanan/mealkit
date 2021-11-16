import { objectType } from 'nexus';
import { prisma } from '../_helpers/prismaClient';

export const Ingredient = objectType({
  name: 'Ingredient',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.field('type', {
      type: 'IngredientType',
      resolve: async (src) => {
        if (!src.ingredientTypeId) {
          return null;
        }
        return await prisma.ingredientType.findUnique({
          where: {
            id: src.ingredientTypeId,
          },
        });
      },
    });
  },
});
