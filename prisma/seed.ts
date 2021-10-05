import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      password: 'password123',
      username: 'alice',
      recipes: {
        createMany: {
          data: [],
        },
      },
    },
  });

  const ingredientTypeIds = {
    seasoning: 1,
    deli: 2,
    dairy: 3,
  };

  const ingredientTypes = await prisma.ingredientType.createMany({
    data: [
      {
        id: ingredientTypeIds.seasoning,
        name: 'seasoning',
      },
      {
        id: ingredientTypeIds.deli,
        name: 'deli',
      },
      {
        id: ingredientTypeIds.dairy,
        name: 'dairy',
      },
    ],
  });

  const [salt, slicedTurkey] = await Promise.all([
    prisma.ingredient.create({
      data: {
        name: 'salt',
        ingredientTypeId: ingredientTypeIds.seasoning,
      },
    }),
    prisma.ingredient.create({
      data: {
        name: 'sliced turkey',
        ingredientTypeId: ingredientTypeIds.deli,
      },
    }),
  ]);

  const recipeCategoryIds = {
    american: 1,
    chinese: 2,
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
  });

  const recipes = await prisma.recipe.create({
    data: {
      name: 'salted sliced turkey',
      categoryId: recipeCategoryIds.chinese,
      userId: alice.id,
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

  console.log({ alice, ingredientTypes, recipes });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });