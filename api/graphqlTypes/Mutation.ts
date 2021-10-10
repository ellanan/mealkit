import { PrismaClient } from '@prisma/client';
import { arg, idArg, mutationType, nonNull, stringArg, list } from 'nexus';
import { NexusMealType } from './MealPlan';

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
        content: nonNull(stringArg()),
        ingredientIds: nonNull(list(nonNull(idArg()))),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.create({
          data: {
            name: args.name,
            content: args.content,
            ingredients: {
              connect: args.ingredientIds.map((ingredientId) => ({
                id: ingredientId,
              })),
            },
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

    t.field('addRecipeToMealPlan', {
      type: 'MealPlanEntry',
      args: {
        mealPlanId: nonNull(idArg()),
        recipeId: nonNull(idArg()),
        date: nonNull(stringArg()),
        mealType: arg({
          type: nonNull(NexusMealType),
        }),
      },
      resolve: async (_parent, args) => {
        return prisma.mealPlanEntry.create({
          data: {
            date: new Date(args.date).toISOString(),
            mealPlan: {
              connect: {
                id: args.mealPlanId,
              },
            },
            recipe: {
              connect: {
                id: args.recipeId,
              },
            },
            mealType: args.mealType,
          },
        });
      },
    });

    t.field('deleteMealPlanEntry', {
      type: 'MealPlanEntry',
      args: {
        mealPlanId: nonNull(idArg()),
      },
      resolve: (_parent, args) => {
        return prisma.mealPlanEntry.delete({
          where: {
            id: args.mealPlanId,
          },
        });
      },
    });
  },
});
