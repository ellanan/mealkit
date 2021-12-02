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
import { MealType } from '@prisma/client';
import { DateTime } from 'luxon';

import { NexusMealType } from './MealPlan';
import { prisma } from '../_helpers/prismaClient';

export const Mutation = mutationType({
  definition(t) {
    t.field('joinMealPlan', {
      type: 'MealPlan',
      args: {
        mealPlanId: nonNull(idArg()),
      },
      resolve: async (_, { mealPlanId }, context) => {
        const user = context.currentUser;
        if (!user) {
          throw new Error('User not found');
        }

        const mealPlan = await prisma.mealPlan.findUnique({
          where: {
            id: mealPlanId,
          },
        });
        if (!mealPlan) {
          throw new Error('MealPlan not found');
        }

        return prisma.mealPlan.update({
          where: {
            id: mealPlanId,
          },
          data: {
            users: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      },
    });

    t.field('createIngredient', {
      type: nonNull('Ingredient'),
      args: {
        name: nonNull(stringArg()),
        ingredientTypeId: nullable(idArg()),
      },
      resolve: async (_parent, args, context) => {
        return prisma.ingredient.create({
          data: {
            user: {
              connect: {
                id: context.currentUser?.id,
              },
            },
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

    t.field('editIngredientType', {
      type: 'IngredientType',
      args: {
        ingredientTypeId: nonNull(idArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.ingredientType.update({
          where: {
            id: args.ingredientTypeId,
          },
          data: {
            name: args.name,
          },
        });
      },
    });

    t.field('deleteIngredientType', {
      type: 'IngredientType',
      args: {
        ingredientTypeId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.ingredientType.delete({
          where: {
            id: args.ingredientTypeId,
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
      resolve: async (_parent, args, context) => {
        return prisma.recipe.create({
          data: {
            user: {
              connect: {
                id: context.currentUser?.id,
              },
            },
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

    t.field('deleteRecipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.recipe.delete({
          where: {
            id: args.recipeId,
          },
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

    t.field('updateIngredient', {
      type: 'Ingredient',
      args: {
        ingredientId: nonNull(idArg()),
        ingredientTypeId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        return prisma.ingredient.update({
          where: {
            id: args.ingredientId,
          },
          data: {
            ingredientType: {
              connect: {
                id: args.ingredientTypeId,
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

    t.field('deleteAllMealPlanEntries', {
      type: 'Int',
      args: {
        mealPlanId: nonNull(idArg()),
      },
      resolve: async (_parent, args) => {
        const results = await prisma.mealPlanEntry.deleteMany({
          where: {
            mealPlanId: args.mealPlanId,
          },
        });
        return results.count;
      },
    });

    t.field('initWithData', {
      type: 'MealPlan',
      args: {
        startDate: nonNull(stringArg()),
      },
      resolve: async (_parent, args, context) => {
        const mealPlanId = context.currentUser?.mealPlanId;
        if (!mealPlanId) {
          throw new Error('Current user does not have a meal plan');
        }
        const startDate = DateTime.fromISO(args.startDate);
        const endDate = startDate.plus({ days: 6 });

        const [toast, soup, shawarmaSalad] = await Promise.all([
          prisma.recipe.create({
            data: {
              name: 'Toast',
              userId: context.currentUser?.id,
              imageUrl: '',
              ingredientQuantities: {
                create: {
                  unit: 'slice',
                  amount: 2,
                  ingredient: {
                    create: {
                      name: 'Bread',
                      ingredientType: {
                        create: {
                          name: 'Bakery',
                        },
                      },
                    },
                  },
                },
              },
            },
          }),

          prisma.recipe.create({
            data: {
              name: 'Tomato Soup',
              userId: context.currentUser?.id,
              imageUrl: '',
              ingredientQuantities: {
                create: [
                  {
                    unit: 'cups',
                    amount: 12,
                    ingredient: {
                      create: {
                        name: 'Water',
                      },
                    },
                  },
                  {
                    unit: 'kg',
                    amount: 1,
                    ingredient: {
                      create: {
                        name: 'Tomatoes',
                      },
                    },
                  },
                  {
                    unit: 'g',
                    amount: 500,
                    ingredient: {
                      create: {
                        name: 'Butter',
                      },
                    },
                  },
                ],
              },
            },
          }),

          prisma.recipe.create({
            data: {
              name: 'Shawarma Salad',
              userId: context.currentUser?.id,
              imageUrl: '',
              ingredientQuantities: {
                create: [
                  {
                    unit: 'g',
                    amount: 400,
                    ingredient: {
                      create: {
                        name: 'Beef',
                      },
                    },
                  },
                  {
                    unit: 'kg',
                    amount: 1,
                    ingredient: {
                      create: {
                        name: 'Hummus',
                      },
                    },
                  },
                  {
                    unit: 'piece',
                    amount: 2,
                    ingredient: {
                      create: {
                        name: 'Pita Bread',
                      },
                    },
                  },
                ],
              },
            },
          }),
        ]);

        await prisma.mealPlanEntry.createMany({
          data: [
            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 1 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 1 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 1 }).toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 2 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 2 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 2 }).toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 3 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 3 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 3 }).toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 4 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 4 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 4 }).toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 5 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 5 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 5 }).toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 6 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 6 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 6 }).toISO(),
              mealPlanId,
            },

            {
              mealType: MealType.BREAKFAST,
              recipeId: toast.id,
              date: startDate.plus({ days: 7 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.LUNCH,
              recipeId: soup.id,
              date: startDate.plus({ days: 7 }).toISO(),
              mealPlanId,
            },
            {
              mealType: MealType.DINNER,
              recipeId: shawarmaSalad.id,
              date: startDate.plus({ days: 7 }).toISO(),
              mealPlanId,
            },
          ],
        });

        return {
          id: mealPlanId,
          schedule: await prisma.mealPlanEntry.findMany({
            where: {
              date: {
                gte: startDate.toISO(),
                lte: endDate.endOf('day').toISO(),
              },
              mealPlan: {
                id: mealPlanId,
              },
            },
          }),
        };
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
