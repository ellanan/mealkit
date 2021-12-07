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
        bakery,
        vegetable,
        pasta,
        dairy,
        fruit,
        meat,
        riceGrain,
        seafood,
        other,
      ] = await Promise.all([
        prisma.ingredientType.create({
          data: {
            name: 'Bakery',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Vegetable',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Pasta',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Dairy',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Fruit',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Meat',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Rice and Grain',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Seafood',
          },
        }),
        prisma.ingredientType.create({
          data: {
            name: 'Other',
          },
        }),
      ]);

      const [rice, yogurt] = await Promise.all([
        prisma.ingredient.create({
          data: {
            name: 'rice',
            ingredientType: {
              connect: {
                id: riceGrain.id,
              },
            },
          },
        }),
        prisma.ingredient.create({
          data: {
            name: 'yogurt',
            ingredientType: {
              connect: {
                id: dairy.id,
              },
            },
          },
        }),
      ]);

      const [
        smoothieBowl,
        avocadoToast,
        yogurtFruitSalad,
        friedRice,
        hummusBowl,
        pokeBowl,
        mushroomPasta,
        salmonQuinoaSalad,
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
                    connect: {
                      id: yogurt.id,
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
                        connect: {
                          id: fruit.id,
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
                        connect: {
                          id: bakery.id,
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
                        connect: {
                          id: vegetable.id,
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
                        connect: {
                          id: vegetable.id,
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
                        connect: {
                          id: dairy.id,
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
                        connect: {
                          id: fruit.id,
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
                    connect: {
                      id: rice.id,
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
                        connect: {
                          id: other.id,
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
                    connect: {
                      id: rice.id,
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
                        connect: {
                          id: seafood.id,
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
                        connect: {
                          id: pasta.id,
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
                        connect: {
                          id: vegetable.id,
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
            name: 'Salmon Quinoa Salad',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/dinner-salmonQuinoaSalad.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 2,
                  ingredient: {
                    create: {
                      name: 'quinoa',
                      ingredientType: {
                        connect: {
                          id: riceGrain.id,
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'oz',
                  amount: 8,
                  ingredient: {
                    create: {
                      name: 'salmon',
                      ingredientType: {
                        connect: {
                          id: seafood.id,
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
                        connect: {
                          id: bakery.id,
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
                        connect: {
                          id: meat.id,
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
            recipeId: salmonQuinoaSalad.id,
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
            recipeId: salmonQuinoaSalad.id,
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
