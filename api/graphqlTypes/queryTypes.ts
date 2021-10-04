import { PrismaClient } from '@prisma/client';
import { objectType, queryType } from 'nexus';

const prisma = new PrismaClient();

export const Query = queryType({
  definition(t) {
    t.list.field('allUsers', {
      type: 'User',
      resolve: () => prisma.user.findMany(),
    });

    t.list.field('ingredients', {
      type: 'Ingredient',
      resolve: () => prisma.ingredient.findMany(),
    });

    t.list.field('ingredientTypes', {
      type: 'IngredientType',
      resolve: () => prisma.ingredientType.findMany(),
    });

    t.list.field('recipes', {
      type: 'Recipe',
      resolve: () => prisma.recipe.findMany(),
    });

    t.list.field('recipeCategories', {
      type: 'RecipeCategory',
      resolve: () => prisma.recipeCategory.findMany(),
    });
  },
});

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.id('id');
    t.string('username');
    t.string('email');
  },
});

export const IngredientType = objectType({
  name: 'IngredientType',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
  },
});

export const Ingredient = objectType({
  name: 'Ingredient',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.field('type', {
      type: 'IngredientType',
      async resolve(src) {
        return await prisma.ingredientType.findUnique({
          where: {
            id: src.ingredientTypeId,
          },
        });
      },
    });
  },
});

export const RecipeCategory = objectType({
  name: 'RecipeCategory',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
  },
});

export const Recipes = objectType({
  name: 'Recipe',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
    t.field('category', {
      type: 'RecipeCategory',
      async resolve(parent) {
        return await prisma.recipeCategory.findUnique({
          where: {
            id: parent.categoryId,
          },
        });
      },
    });
    t.list.field('ingredients', {
      type: 'Ingredient',
      async resolve(parent) {
        return prisma.ingredient.findMany({
          where: {
            recipeId: {
              equals: parent.id,
            },
          },
        });
      },
    });
  },
});
