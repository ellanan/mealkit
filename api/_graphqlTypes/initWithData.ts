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

      const [
        smoothieBowl,
        avocadoToast,
        yogurtFruitSalad,
        friedRice,
        hummusBowl,
        pokeBowl,
        mushroomPasta,
        seafoodPasta,
        tacos,
      ] = await Promise.all([
        prisma.recipe.create({
          data: {
            name: 'Smoothie Bowl',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/breakfast-smoothieBowl.jpg')
              .default,
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'Yogurt',
                      ingredientType: {
                        create: {
                          name: 'Dairy',
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'Mixed Fruits',
                      ingredientType: {
                        create: {
                          name: 'Fruit',
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1 / 2,
                  ingredient: {
                    create: {
                      name: 'Granola',
                      ingredientType: {
                        create: {
                          name: 'Rice & Grain',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Avocado Toast',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/breakfast-avocadoToast.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'slices',
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
                {
                  unit: 'unit',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'Avocado',
                      ingredientType: {
                        create: {
                          name: 'Vegetable',
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'unit',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'Tomato',
                      ingredientType: {
                        name: 'Vegetable',
                      },
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Yogurt & Fruit Salad',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/breakfast-yogurtFruits.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'yogurt',
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'strawberries',
                      ingredientType: {
                        name: 'Fruit',
                      },
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Fried Rice',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/lunch-friedRice.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'rice',
                      ingredientType: {
                        name: 'Rice & Grain',
                      },
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Hummus Bowl',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/lunch-hummusBowl.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'hummus',
                      ingredientType: {
                        create: {
                          name: 'Dip & Spread',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Poke Bowl',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/lunch-pokeBowl.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'rice',
                      ingredientType: {
                        name: 'Rice & Grain',
                      },
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'salmon',
                      ingredientType: {
                        create: {
                          name: 'Seafood',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Mushroom Pasta',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/dinner-mushroomPasta.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'pasta',
                      ingredientType: {
                        create: {
                          name: 'Pasta',
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'mushrooms',
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Seafood Pasta',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/dinner-seafoodPasta.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'pasta',
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    name: 'seafood',
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: 'Tacos',
            userId: context.currentUser?.id,
            imageUrl: require('../../src/images/dinner-tacos.jpg'),
            ingredientQuantities: {
              create: [
                {
                  unit: 'slice',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'taco wrap',
                      ingredientType: {
                        name: 'Bakery',
                      },
                    },
                  },
                },
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'grilled chicken',
                      ingredientType: {
                        name: 'Meat',
                      },
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
            recipeId: smoothieBowl.id,
            date: startDate.toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: friedRice.id,
            date: startDate.toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: tacos.id,
            date: startDate.toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: avocadoToast.id,
            date: startDate.plus({ days: 1 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: hummusBowl.id,
            date: startDate.plus({ days: 1 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: seafoodPasta.id,
            date: startDate.plus({ days: 1 }).toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: yogurtFruitSalad.id,
            date: startDate.plus({ days: 2 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: pokeBowl.id,
            date: startDate.plus({ days: 2 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: seafoodPasta.id,
            date: startDate.plus({ days: 2 }).toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: smoothieBowl.id,
            date: startDate.plus({ days: 3 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: friedRice.id,
            date: startDate.plus({ days: 3 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: tacos.id,
            date: startDate.plus({ days: 3 }).toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: avocadoToast.id,
            date: startDate.plus({ days: 4 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: pokeBowl.id,
            date: startDate.plus({ days: 4 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: mushroomPasta.id,
            date: startDate.plus({ days: 4 }).toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: avocadoToast.id,
            date: startDate.plus({ days: 5 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: hummusBowl.id,
            date: startDate.plus({ days: 5 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: mushroomPasta.id,
            date: startDate.plus({ days: 5 }).toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: smoothieBowl.id,
            date: startDate.plus({ days: 6 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: pokeBowl.id,
            date: startDate.plus({ days: 6 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: tacos.id,
            date: startDate.plus({ days: 6 }).toISO(),
            mealPlanId,
          },

          {
            mealType: MealType.BREAKFAST,
            recipeId: avocadoToast.id,
            date: startDate.plus({ days: 7 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: hummusBowl.id,
            date: startDate.plus({ days: 7 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: mushroomPasta.id,
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
