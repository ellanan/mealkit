import { prisma } from '../api/_helpers/prismaClient';

async function main() {
  const alice = await prisma.user.upsert({
    where: { id: 'ckuk47cjl0000u7rzs57upv7s' },
    update: {},
    create: {
      id: 'ckuk47cjl0000u7rzs57upv7s',
      authProviderId: 'seed|0',
      password: 'password123',
      mealPlan: {
        create: {},
      },
      recipes: {
        createMany: {
          data: [],
        },
      },
    },
  });

  const [seasoning, deli] = await Promise.all([
    prisma.ingredientType.upsert({
      where: {
        id: 'ckuk47d080000u7rz2dpwgqah',
      },
      update: {},
      create: {
        name: 'seasoning',
      },
    }),
    prisma.ingredientType.upsert({
      where: {
        id: 'ckuk47d090001u7rz16qi19sl',
      },
      update: {},
      create: {
        name: 'deli',
      },
    }),
  ]);

  const [salt, slicedTurkey] = await Promise.all([
    prisma.ingredient.upsert({
      update: {},
      create: {
        id: 'salt',
        name: 'salt',
        ingredientTypeId: seasoning.id,
      },
      where: {
        id: 'salt',
      },
    }),
    prisma.ingredient.upsert({
      update: {},
      create: {
        id: 'slicedTurkey',
        name: 'sliced turkey',
        ingredientTypeId: deli.id,
      },
      where: {
        id: 'slicedTurkey',
      },
    }),
  ]);

  const recipeCategoryIds = {
    american: 'ckuk47dte0003u7rz15wvhr1c',
    chinese: 'ckuk47dte0004u7rzhc1vfist',
  };

  const recipeCategories = await prisma.recipeCategory.createMany({
    data: [
      {
        id: recipeCategoryIds.american,
        name: 'american',
      },
      {
        id: recipeCategoryIds.chinese,
        name: 'chinese',
      },
    ],
    skipDuplicates: true,
  });

  const saltedSlicedTurkeyRecipeData = {
    name: 'salted sliced turkey',
    content: 'some contents here',
    category: {
      connect: {
        id: recipeCategoryIds.chinese,
      },
    },
    user: {
      connect: {
        id: alice.id,
      },
    },
    ingredientQuantities: {
      connectOrCreate: [
        {
          create: {
            ingredient: {
              connect: {
                id: salt.id,
              },
            },
            unit: 'tsp',
            amount: 2,
          },
          where: {
            ingredientId_recipeId: {
              ingredientId: salt.id,
              recipeId: 'ckuk47dyc0029u7rz8ojx9u8b',
            },
          },
        },
        {
          create: {
            ingredient: {
              connect: {
                id: slicedTurkey.id,
              },
            },
            unit: 'gram',
            amount: 200,
          },
          where: {
            ingredientId_recipeId: {
              ingredientId: slicedTurkey.id,
              recipeId: 'ckuk47dyc0029u7rz8ojx9u8b',
            },
          },
        },
      ],
    },
  };

  const saltedSlicedTurkeyRecipe = await prisma.recipe.upsert({
    where: {
      id: 'ckuk47dyc0029u7rz8ojx9u8b',
    },
    update: saltedSlicedTurkeyRecipeData,
    create: saltedSlicedTurkeyRecipeData,
  });

  const mealPlanEntry = await prisma.mealPlanEntry.upsert({
    where: {
      id: 'somemealplanid',
    },
    update: {},
    create: {
      date: new Date('2021-01-01').toISOString(),
      mealType: 'BREAKFAST',
      mealPlan: {
        connect: {
          id: alice.mealPlanId,
        },
      },
      recipe: {
        connect: {
          id: saltedSlicedTurkeyRecipe.id,
        },
      },
    },
  });

  console.log({
    alice,
    saltedSlicedTurkeyRecipe,
    recipeCategories,
    mealPlanEntry,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
