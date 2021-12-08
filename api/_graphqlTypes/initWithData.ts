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

      const [bakery, vegetable, pasta, dairy, fruit, meat, riceGrain, other] =
        await Promise.all([
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
              name: 'Other',
            },
          }),
        ]);

      const [rice, yogurt, mushroom] = await Promise.all([
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
        prisma.ingredient.create({
          data: {
            name: 'mushroom',
            ingredientType: {
              connect: {
                id: vegetable.id,
              },
            },
          },
        }),
      ]);

      const [
        smoothieBowl,
        omelette,
        yogurtFruitSalad,
        veggieToast,
        hummusBowl,
        steakWithVeggies,
        mushroomPasta,
        beefDon,
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
            name: 'Omelette',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/breakfast-omelette.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'units',
                  amount: 2,
                  ingredient: {
                    create: {
                      name: 'egg',
                      ingredientType: {
                        connect: {
                          id: dairy.id,
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'g',
                  amount: 50,
                  ingredient: {
                    create: {
                      name: 'spinach',
                      ingredientType: {
                        connect: {
                          id: vegetable.id,
                        },
                      },
                    },
                  },
                },
                {
                  unit: 'g',
                  amount: 50,
                  ingredient: {
                    connect: {
                      id: mushroom.id,
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
            name: 'Veggie Toast',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/lunch-veggieToast.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'slices',
                  amount: 2,
                  ingredient: {
                    create: {
                      name: 'bread',
                      ingredientType: {
                        connect: {
                          id: bakery.id,
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
            name: 'Steak with Veggies',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/dinner-steakWithVeggie.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 6,
                  ingredient: {
                    create: {
                      name: 'steak',
                      ingredientType: {
                        connect: {
                          id: meat.id,
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
                      name: 'mixed veggies',
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
            name: 'Beef Don',
            userId: context.currentUser?.id,
            imageUrl:
              'https://mealkit.vercel.app/recipeImages/lunch-beefDon.jpg',
            ingredientQuantities: {
              create: [
                {
                  unit: 'oz',
                  amount: 10,
                  ingredient: {
                    create: {
                      name: 'beef',
                      ingredientType: {
                        connect: {
                          id: meat.id,
                        },
                      },
                    },
                  },
                },
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
            recipeId: veggieToast.id,
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
            recipeId: omelette.id,
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
            recipeId: steakWithVeggies.id,
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
            recipeId: beefDon.id,
            date: startDate.plus({ days: 2 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.DINNER,
            recipeId: steakWithVeggies.id,
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
            recipeId: veggieToast.id,
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
            recipeId: omelette.id,
            date: startDate.plus({ days: 4 }).toISO(),
            mealPlanId,
          },
          {
            mealType: MealType.LUNCH,
            recipeId: beefDon.id,
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
            recipeId: omelette.id,
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
            recipeId: beefDon.id,
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
            recipeId: omelette.id,
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
