import { nonNull, stringArg } from 'nexus';
import { MealType } from '@prisma/client';
import { DateTime } from 'luxon';

import { prisma } from '../_helpers/prismaClient';
import { ObjectDefinitionBlock } from 'nexus/dist/blocks';

export const initWithData = (t: ObjectDefinitionBlock<'Mutation'>) => {
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
};
