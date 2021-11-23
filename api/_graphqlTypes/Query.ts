import _ from 'lodash';
import { PrismaClient } from '@prisma/client';
import {
  arg,
  enumType,
  idArg,
  intArg,
  nonNull,
  queryType,
  stringArg,
} from 'nexus';

export * from './Ingredient';
export * from './IngredientType';
export * from './Recipe';
export * from './RecipeCategory';
export * from './RecipeIngredientQuantity';
export * from './User';
export * from './MealPlan';

const prisma = new PrismaClient();

export const Query = queryType({
  definition(t) {
    t.field('currentUser', {
      type: 'User',
      resolve: (_parent, _args, context) => {
        if (_.isNil(context.currentUser?.id)) return null;
        return prisma.user.findUnique({
          where: {
            id: context.currentUser?.id,
          },
        });
      },
    });

    t.nonNull.list.nonNull.field('allUsers', {
      type: 'User',
      resolve: () => prisma.user.findMany(),
    });

    t.nonNull.list.nonNull.field('ingredients', {
      type: 'Ingredient',
      resolve: () => prisma.ingredient.findMany(),
    });

    t.nonNull.list.nonNull.field('ingredientTypes', {
      type: 'IngredientType',
      resolve: () => prisma.ingredientType.findMany(),
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

    t.field('recipe', {
      type: 'Recipe',
      args: {
        recipeId: nonNull(idArg()),
      },
      resolve: async (_parent, args) =>
        prisma.recipe.findUnique({
          where: { id: args.recipeId },
          include: {
            category: true,
            ingredientQuantities: {
              include: {
                ingredient: true,
              },
            },
          },
        }),
    });

    t.nonNull.list.nonNull.field('recipeCategories', {
      type: 'RecipeCategory',
      resolve: () => prisma.recipeCategory.findMany(),
    });
  },
});
