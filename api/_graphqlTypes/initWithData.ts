import { nonNull, stringArg } from 'nexus';
import { MealType } from '@prisma/client';
import { DateTime } from 'luxon';
// @ts-expect-error
import scuid from 'scuid';

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

      const bakeryIngredientTypeId = scuid();
      const dairyIngredientTypeId = scuid();
      const fruitIngredientTypeId = scuid();
      const meatIngredientTypeId = scuid();
      const otherIngredientTypeId = scuid();
      const pastaIngredientTypeId = scuid();
      const riceGrainIngredientTypeId = scuid();
      const seafoodIngredientTypeId = scuid();
      const vegetableIngredientTypeId = scuid();

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
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/breakfast-smoothieBowl.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'Yogurt',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: dairyIngredientTypeId,
                            name: 'Dairy',
                          },
                          where: {
                            id: dairyIngredientTypeId,
                          },
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
                        connectOrCreate: {
                          create: {
                            id: fruitIngredientTypeId,
                            name: 'Fruit',
                          },
                          where: {
                            id: fruitIngredientTypeId,
                          },
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
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/breakfast-avocadoToast.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'slices',
                  amount: 2,
                  ingredient: {
                    create: {
                      name: 'Bread',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: bakeryIngredientTypeId,
                            name: 'Bakery',
                          },
                          where: {
                            id: bakeryIngredientTypeId,
                          },
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
                        connectOrCreate: {
                          create: {
                            id: vegetableIngredientTypeId,
                            name: 'Vegetable',
                          },
                          where: {
                            id: vegetableIngredientTypeId,
                          },
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
                        connectOrCreate: {
                          where: {
                            id: vegetableIngredientTypeId,
                          },
                          create: {
                            id: vegetableIngredientTypeId,
                            name: 'Vegetable',
                          },
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
            name: 'Yogurt & Fruit Salad',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/breakfast-yogurtFruits.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'yogurt',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: dairyIngredientTypeId,
                            name: 'Dairy',
                          },
                          where: {
                            id: dairyIngredientTypeId,
                          },
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
                      name: 'strawberries',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: fruitIngredientTypeId,
                            name: 'Fruit',
                          },
                          where: {
                            id: fruitIngredientTypeId,
                          },
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
            name: 'Fried Rice',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/lunch-friedRice.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'rice',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: riceGrainIngredientTypeId,
                            name: 'Rice & Grain',
                          },
                          where: {
                            id: riceGrainIngredientTypeId,
                          },
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
            name: 'Hummus Bowl',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/lunch-hummusBowl.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'hummus',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: otherIngredientTypeId,
                            name: 'Other',
                          },
                          where: {
                            id: otherIngredientTypeId,
                          },
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
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/lunch-pokeBowl.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'cup',
                  amount: 1,
                  ingredient: {
                    create: {
                      name: 'rice',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: riceGrainIngredientTypeId,
                            name: 'Rice & Grain',
                          },
                          where: {
                            id: riceGrainIngredientTypeId,
                          },
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
                      name: 'salmon',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: seafoodIngredientTypeId,
                            name: 'Seafood',
                          },
                          where: {
                            id: seafoodIngredientTypeId,
                          },
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
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/dinner-mushroomPasta.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'pasta',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: pastaIngredientTypeId,
                            name: 'Pasta',
                          },
                          where: {
                            id: pastaIngredientTypeId,
                          },
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
                      name: 'mushroom',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: vegetableIngredientTypeId,
                            name: 'Vegetable',
                          },
                          where: {
                            id: vegetableIngredientTypeId,
                          },
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
            name: 'Seafood Pasta',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/dinner-seafoodPasta.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'pasta',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: pastaIngredientTypeId,
                            name: 'Pasta',
                          },
                          where: {
                            id: pastaIngredientTypeId,
                          },
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
                      name: 'mixed seafood',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: seafoodIngredientTypeId,
                            name: 'Seafood',
                          },
                          where: {
                            id: seafoodIngredientTypeId,
                          },
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
            name: 'Tacos',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/dinner-tacos.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'slice',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'taco wrap',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: bakeryIngredientTypeId,
                            name: 'Bakery',
                          },
                          where: {
                            id: bakeryIngredientTypeId,
                          },
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
                      name: 'grilled chicken',
                      ingredientType: {
                        connectOrCreate: {
                          create: {
                            id: meatIngredientTypeId,
                            name: 'Meat',
                          },
                          where: {
                            id: meatIngredientTypeId,
                          },
                        },
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
