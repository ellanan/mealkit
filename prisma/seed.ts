import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      id: 'ckuk47cjl0000u7rzs57upv7s',
      email: 'alice@example.com',
      password: 'password123',
      username: 'alice',
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
    prisma.ingredient.create({
      data: {
        name: 'salt',
        ingredientTypeId: seasoning.id,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'sliced turkey',
        ingredientTypeId: deli.id,
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

  const saltedSlicedTurkeyRecipe = await prisma.recipe.upsert({
    where: {
      id: 'ckuk47dyc0029u7rz8ojx9u8b',
    },
    update: {},
    create: {
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
      ingredients: {
        connect: [
          {
            id: salt.id,
          },
          {
            id: slicedTurkey.id,
          },
        ],
      },
    },
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
