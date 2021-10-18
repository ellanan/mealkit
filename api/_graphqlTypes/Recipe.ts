import { PrismaClient } from '@prisma/client';
import { objectType } from 'nexus';

const prisma = new PrismaClient();

export const Recipe = objectType({
  name: 'Recipe',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.string('imageUrl');
    t.string('content');
    t.field('category', {
      type: 'RecipeCategory',
      resolve: async (parent) => {
        return (
          (
            await prisma.recipe.findUnique({
              where: {
                id: parent.id,
              },
              include: {
                category: true,
              },
            })
          )?.category ?? null
        );
      },
    });
    t.nonNull.list.nonNull.field('ingredientQuantities', {
      type: 'RecipeIngredientQuantity',
      resolve: async (parent) => {
        return (
          (
            await prisma.recipe.findUnique({
              where: {
                id: parent.id,
              },
              include: {
                ingredientQuantities: true,
              },
            })
          )?.ingredientQuantities ?? []
        );
      },
    });
  },
});
