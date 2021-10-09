import { PrismaClient } from '@prisma/client';
import { idArg, nonNull, queryType } from 'nexus';

export * from './Ingredient';
export * from './IngredientType';
export * from './Recipe';
export * from './RecipeCategory';
export * from './User';

const prisma = new PrismaClient();

export const Query = queryType({
  definition(t) {
    t.field('currentUser', {
      type: 'User',
      resolve: (_parent, _args, context) =>
        prisma.user.findUnique({
          where: {
            id: context.currentUser?.id,
          },
        }),
    });

    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: () => prisma.user.findMany(),
    });

    t.nonNull.list.nonNull.field('ingredients', {
      type: 'Ingredient',
      resolve: () => prisma.ingredient.findMany(),
    });

    t.nonNull.list.nonNull.field('ingredientTypes', {
      type: 'IngredientType',
      resolve: () => prisma.ingredientType.findMany(),
    });

    t.nonNull.list.nonNull.field('recipes', {
      type: 'Recipe',
      resolve: () => prisma.recipe.findMany(),
    });

    t.field('recipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
      },
      resolve: async (_parent, args) =>
        prisma.recipe.findUnique({
          where: { id: args.recipeId },
        }),
    });

    t.nonNull.list.nonNull.field('recipeCategories', {
      type: 'RecipeCategory',
      resolve: () => prisma.recipeCategory.findMany(),
    });
  },
});
