import { MealType, PrismaClient } from '@prisma/client';
import {
  arg,
  idArg,
  enumType,
  intArg,
  nonNull,
  objectType,
  stringArg,
} from 'nexus';

const prisma = new PrismaClient();

export const NexusMealType = enumType({
  name: 'MealType',
  members: MealType,
});

export const MealPlanEntry = objectType({
  name: 'MealPlanEntry',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.field('date', {
      type: 'String',
      resolve(parent) {
        return parent.date.toISOString();
      },
    });
    t.nonNull.field('mealType', {
      type: 'MealType',
    });
    t.nonNull.field('recipe', {
      type: 'Recipe',
      resolve: async (parent) => {
        const recipe = await prisma.recipe.findUnique({
          where: {
            id: parent.recipeId,
          },
        });
        if (!recipe) {
          throw new Error(
            `Could not find recipe for ${JSON.stringify(parent)}`
          );
        }
        return recipe;
      },
    });
  },
});

export const MealPlan = objectType({
  name: 'MealPlan',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.list.nonNull.field('schedule', {
      type: 'MealPlanEntry',
      args: {
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
      },
      async resolve(parent, args) {
        const mealPlanEntries = await prisma.mealPlanEntry.findMany({
          where: {
            date: {
              gte: new Date(args.startDate).toISOString(),
              lte: new Date(args.endDate).toISOString(),
            },
            mealPlan: {
              id: parent.id,
            },
          },
        });
        return mealPlanEntries;
      },
    });

    t.nonNull.list.nonNull.field('popularRecipes', {
      type: 'Recipe',
      args: {
        startDate: nonNull(stringArg()),
        endDate: nonNull(stringArg()),
        limit: nonNull(intArg({ default: 10 })),
      },
      async resolve(parent, args) {
        const groupByResults = await prisma.mealPlanEntry.groupBy({
          by: ['recipeId'],
          _count: {
            recipeId: true,
          },
          where: {
            date: {
              gte: new Date(args.startDate).toISOString(),
              lte: new Date(args.endDate).toISOString(),
            },
            mealPlan: {
              id: parent.id,
            },
          },
          orderBy: {
            _count: {
              recipeId: 'desc',
            },
          },
          take: args.limit,
        });

        return prisma.recipe.findMany({
          where: {
            id: {
              in: groupByResults.map((r) => r.recipeId),
            },
          },
        });
      },
    });

    t.nonNull.list.nonNull.field('recipes', {
      type: 'Recipe',
      args: {
        orderBy: arg({
          type: nonNull(
            enumType({
              name: 'RecipeOrderBy',
              members: ['createdAt', 'updatedAt'],
            })
          ),
          default: 'createdAt',
        }),

        order: nonNull(
          arg({
            type: 'Order',
            default: 'desc',
          })
        ),

        limit: nonNull(intArg({ default: 10 })),
        cursor: idArg(),
        search: stringArg(),
      },
      resolve: (_parent, args) => {
        return prisma.recipe.findMany({
          where: {
            name: args.search
              ? {
                  contains: args.search,
                  mode: 'insensitive',
                }
              : undefined,
          },
          orderBy: {
            [args.orderBy]: args.order,
          },
          take: args.limit,
          skip: args.cursor ? 1 : 0,
          cursor: args.cursor ? { id: args.cursor } : undefined,
        });
      },
    });
  },
});
