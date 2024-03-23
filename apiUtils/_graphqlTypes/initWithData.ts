import { IngredientType, MealType } from "@prisma/client";
import { DateTime } from "luxon";
import { nonNull, stringArg } from "nexus";
import { ObjectDefinitionBlock } from "nexus/dist/blocks";

import { prisma } from "../_helpers/prismaClient";

export const initWithData = (t: ObjectDefinitionBlock<"Mutation">) => {
  t.field("initWithData", {
    type: "MealPlan",
    args: {
      startDate: nonNull(stringArg()),
    },
    resolve: async (_parent, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new Error("User must be logged in");
      }
      const mealPlanId = currentUser.mealPlanId;
      if (!mealPlanId) {
        throw new Error("Current user does not have a meal plan");
      }
      const startDate = DateTime.fromISO(args.startDate).plus({ days: 1 });
      const endDate = startDate.plus({ days: 6 });

      const [bakery, vegetable, pasta, dairy, fruit, meat, riceGrain, other] =
        await Promise.all([
          prisma.ingredientType.create({
            data: {
              name: "Bakery",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Vegetable",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Pasta",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Dairy",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Fruit",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Meat",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Rice and Grain",
            },
          }),
          prisma.ingredientType.create({
            data: {
              name: "Other",
            },
          }),
        ]);

      const createIngredient = ({
        name,
        ingredientType,
      }: {
        name: string;
        ingredientType: IngredientType;
      }) => {
        return prisma.ingredient.create({
          data: {
            name,
            ingredientType: {
              connect: {
                id: ingredientType.id,
              },
            },
            user: {
              connect: {
                id: currentUser.id,
              },
            },
          },
        });
      };

      const [
        rice,
        yogurt,
        mixedFruits,
        granola,
        egg,
        spinach,
        mushroom,
        strawberries,
        bread,
        hummus,
        steak,
        mixedVeggies,
        pici,
        tacoWrap,
        grilledChicken,
      ] = await Promise.all([
        createIngredient({
          name: "rice",
          ingredientType: riceGrain,
        }),
        createIngredient({
          name: "yogurt",
          ingredientType: dairy,
        }),
        createIngredient({
          name: "mixed fruits",
          ingredientType: fruit,
        }),
        createIngredient({
          name: "granola",
          ingredientType: other,
        }),
        createIngredient({
          name: "egg",
          ingredientType: dairy,
        }),
        createIngredient({
          name: "spinach",
          ingredientType: vegetable,
        }),
        createIngredient({
          name: "mushroom",
          ingredientType: vegetable,
        }),
        createIngredient({
          name: "strawberries",
          ingredientType: fruit,
        }),
        createIngredient({
          name: "bread",
          ingredientType: bakery,
        }),
        createIngredient({
          name: "hummus",
          ingredientType: other,
        }),
        createIngredient({
          name: "steak",
          ingredientType: meat,
        }),
        createIngredient({
          name: "mixed veggies",
          ingredientType: vegetable,
        }),
        createIngredient({
          name: "pici",
          ingredientType: pasta,
        }),
        createIngredient({
          name: "taco wrap",
          ingredientType: bakery,
        }),
        createIngredient({
          name: "grilled chicken",
          ingredientType: meat,
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
            name: "Smoothie Bowl",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/breakfast-smoothieBowl.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: yogurt.id,
                    },
                  },
                },
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: mixedFruits.id,
                    },
                  },
                },
                {
                  unit: "cup",
                  amount: 1 / 2,
                  ingredient: {
                    connect: {
                      id: granola.id,
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: "Omelette",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/breakfast-omelette.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "units",
                  amount: 2,
                  ingredient: {
                    connect: {
                      id: egg.id,
                    },
                  },
                },
                {
                  unit: "g",
                  amount: 50,
                  ingredient: {
                    connect: {
                      id: spinach.id,
                    },
                  },
                },
                {
                  unit: "g",
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
            name: "Yogurt & Fruit Salad",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/breakfast-yogurtFruits.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: yogurt.id,
                    },
                  },
                },
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: strawberries.id,
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: "Veggie Toast",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/lunch-veggieToast.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "slices",
                  amount: 2,
                  ingredient: {
                    connect: {
                      id: bread.id,
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: "Hummus Bowl",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/lunch-hummusBowl.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: hummus.id,
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: "Steak with Veggies",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/dinner-steakWithVeggie.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "oz",
                  amount: 6,
                  ingredient: {
                    connect: {
                      id: steak.id,
                    },
                  },
                },
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: mixedVeggies.id,
                    },
                  },
                },
              ],
            },
          },
        }),

        prisma.recipe.create({
          data: {
            name: "Mushroom Pasta",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/dinner-mushroomPasta.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "oz",
                  amount: 6,
                  ingredient: {
                    connect: {
                      id: pici.id,
                    },
                  },
                },
                {
                  unit: "cup",
                  amount: 1,
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
            name: "Beef Don",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/lunch-beefDon.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "oz",
                  amount: 10,
                  ingredient: {
                    connect: {
                      id: steak.id,
                    },
                  },
                },
                {
                  unit: "cup",
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
            name: "Tacos",
            userId: context.currentUser?.id,
            imageUrl:
              "https://mealkit.vercel.app/recipeImages/dinner-tacos.jpg",
            ingredientQuantities: {
              create: [
                {
                  unit: "slice",
                  amount: 6,
                  ingredient: {
                    connect: {
                      id: tacoWrap.id,
                    },
                  },
                },
                {
                  unit: "cup",
                  amount: 1,
                  ingredient: {
                    connect: {
                      id: grilledChicken.id,
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
        ],
      });

      return {
        id: mealPlanId,
        schedule: await prisma.mealPlanEntry.findMany({
          where: {
            date: {
              gte: startDate.toISO(),
              lte: endDate.endOf("day").toISO(),
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
