import { PrismaClient } from '@prisma/client';
import { objectType } from 'nexus';

const prisma = new PrismaClient();

export const RecipeIngredientQuantity = objectType({
  name: 'RecipeIngredientQuantity',
  definition(t) {
    t.nonNull.string('unit');
    t.nonNull.int('amount');
    t.field('recipe', {
      type: 'Recipe',
      resolve: async (parent) => {
        return await prisma.recipe.findUnique({
          where: {
            id: parent.recipeId,
          },
        });
      },
    });
    t.field('ingredient', {
      type: 'Ingredient',
      resolve: async (parent) => {
        return await prisma.ingredient.findUnique({
          where: {
            id: parent.ingredientId,
          },
        });
      },
    });
  },
});
