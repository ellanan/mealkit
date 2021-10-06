import { PrismaClient } from '@prisma/client';
import { idArg, mutationType, nonNull, stringArg } from 'nexus';

const prisma = new PrismaClient();

export const Mutation = mutationType({
  definition(t) {
    t.field('createIngredient', {
      type: 'Ingredient',
      args: {
        name: nonNull(stringArg()),
        ingredientTypeId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.ingredient.create({
          data: {
            name: args.name,
            ingredientType: {
              connect: {
                id: args.ingredientTypeId,
              },
            },
          },
        });
      },
    });

    t.field('createIngredientType', {
      type: 'IngredientType',
      args: {
        name: nonNull(stringArg()),
      },
      async resolve(_parent, args) {
        return prisma.ingredientType.create({
          data: {
            name: args.name,
          },
        });
      },
    });

    t.field('createRecipe', {
      type: 'Recipe',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.create({
          data: {
            name: args.name,
          },
        });
      },
    });

    t.field('addIngredientToRecipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
        ingredientId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.update({
          where: {
            id: args.recipeId,
          },
          data: {
            ingredients: {
              connect: {
                id: args.ingredientId,
              },
            },
          },
        });
      },
    });

    t.field('removeIngredientFromRecipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
        ingredientId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.update({
          where: {
            id: args.recipeId,
          },
          data: {
            ingredients: {
              disconnect: {
                id: args.ingredientId,
              },
            },
          },
        });
      },
    });
  },
});
