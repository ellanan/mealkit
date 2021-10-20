import { PrismaClient } from '@prisma/client';
import {
  arg,
  idArg,
  mutationType,
  nonNull,
  nullable,
  stringArg,
  list,
  inputObjectType,
  intArg,
} from 'nexus';
import _ from 'lodash';

import { NexusMealType } from './MealPlan';

const prisma = new PrismaClient();

export const Mutation = mutationType({
  definition(t) {
    t.field('createIngredient', {
      type: nonNull('Ingredient'),
      args: {
        name: nonNull(stringArg()),
        ingredientTypeId: nullable(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.ingredient.create({
          data: {
            name: args.name,
            ...(args.ingredientTypeId
              ? {
                  ingredientType: {
                    connect: {
                      id: args.ingredientTypeId,
                    },
                  },
                }
              : null),
          },
        });
      },
    });

    t.field('createIngredientType', {
      type: 'IngredientType',
      args: {
        name: nonNull(stringArg()),
      },
      resolve: async (_parent, args) => {
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
        imageUrl: stringArg(),
        content: stringArg(),
        ingredientQuantities: nonNull(
          list(
            nonNull(
              arg({
                type: nonNull(IngredientQuantityInput),
              })
            )
          )
        ),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.create({
          data: {
            name: args.name,
            imageUrl: args.imageUrl,
            content: args.content,
            ingredientQuantities: {
              createMany: {
                data: args.ingredientQuantities.map(
                  ({ unit, amount, ingredientId }) => ({
                    unit,
                    amount,
                    ingredientId,
                  })
                ),
              },
            },
          },
        });
      },
    });

    t.field('editRecipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(stringArg()),
        name: nullable(stringArg()),
        imageUrl: nullable(stringArg()),
        content: nullable(stringArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.update({
          where: {
            id: args.recipeId,
          },
          data: _.omitBy(
            {
              name: args.name,
              imageUrl: args.imageUrl,
              content: args.content,
            },
            _.isNil
          ),
        });
      },
    });

    t.field('addIngredientQuantityToRecipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
        ingredientQuantity: nonNull(IngredientQuantityInput),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.update({
          where: {
            id: args.recipeId,
          },
          data: {
            ingredientQuantities: {
              create: {
                amount: args.ingredientQuantity.amount,
                unit: args.ingredientQuantity.unit,
                ingredientId: args.ingredientQuantity.ingredientId,
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
            ingredientQuantities: {
              delete: {
                ingredientId_recipeId: {
                  ingredientId: args.ingredientId,
                  recipeId: args.recipeId,
                },
              },
            },
          },
        });
      },
    });

    t.field('updateIngredientQuantityInRecipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
        ingredientId: nonNull(idArg()),
        amount: nullable(intArg()),
        unit: nullable(stringArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.update({
          where: {
            id: args.recipeId,
          },
          data: {
            ingredientQuantities: {
              update: {
                where: {
                  ingredientId_recipeId: {
                    ingredientId: args.ingredientId,
                    recipeId: args.recipeId,
                  },
                },
                data: _.omitBy(
                  {
                    amount: args.amount,
                    unit: args.unit,
                  },
                  _.isNil
                ),
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
        mealPlanEntryId: nonNull(idArg()),
      },
      resolve: (_parent, args) => {
        return prisma.mealPlanEntry.delete({
          where: {
            id: args.mealPlanEntryId,
          },
        });
      },
    });
  },
});

export const IngredientQuantityInput = inputObjectType({
  name: 'IngredientQuantityInput',
  definition(t) {
    t.nonNull.string('unit');
    t.nonNull.int('amount');
    t.nonNull.string('ingredientId');
  },
});
