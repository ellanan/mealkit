import { MealType, PrismaClient } from '@prisma/client';
import { enumType, nonNull, objectType, stringArg } from 'nexus';

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
      resolve(parent) {
        return prisma.recipe.findUnique({
          where: {
            id: parent.recipeId,
          },
        });
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
  },
});
