import { PrismaClient } from '@prisma/client';
import { objectType } from 'nexus';

const prisma = new PrismaClient();

export const RecipeIngredientQuantity = objectType({
  name: 'RecipeIngredientQuantity',
  definition(t) {
    t.nonNull.string('unit');
    t.nonNull.int('amount');
    t.nonNull.field('recipe', {
      type: 'Recipe',
      resolve: async (parent) => {
        const recipe = await prisma.recipe.findUnique({
          where: {
            id: parent.recipeId,
          },
        });

        if (!recipe) {
          throw new Error(`Couldn't find recipe for ${JSON.stringify(parent)}`);
        }

        return recipe;
      },
    });
    t.nonNull.field('ingredient', {
      type: 'Ingredient',
      resolve: async (parent) => {
        const ingredient = await prisma.ingredient.findUnique({
          where: {
            id: parent.ingredientId,
          },
        });

        if (!ingredient) {
          throw new Error(
            `Couldn't find ingredient for ${JSON.stringify(parent)}`
          );
        }

        return ingredient;
      },
    });
  },
});
