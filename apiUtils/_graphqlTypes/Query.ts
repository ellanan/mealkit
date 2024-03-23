import _ from "lodash";
import { idArg, nonNull, queryType } from "nexus";

import { prisma } from "../_helpers/prismaClient";

export * from "./Ingredient";
export * from "./IngredientType";
export * from "./Recipe";
export * from "./RecipeCategory";
export * from "./RecipeIngredientQuantity";
export * from "./User";
export * from "./MealPlan";

export const Query = queryType({
  definition(t) {
    t.field("currentUser", {
      type: "User",
      resolve: (_parent, _args, context) => {
        if (_.isNil(context.currentUser?.id)) return null;
        return prisma.user.findUnique({
          where: {
            id: context.currentUser?.id,
          },
        });
      },
    });

    t.nonNull.list.nonNull.field("allUsers", {
      type: "User",
      resolve: () => prisma.user.findMany(),
    });

    t.nonNull.list.nonNull.field("ingredients", {
      type: "Ingredient",
      resolve: () => prisma.ingredient.findMany(),
    });

    t.nonNull.list.nonNull.field("ingredientTypes", {
      type: "IngredientType",
      resolve: () => prisma.ingredientType.findMany(),
    });

    t.field("recipe", {
      type: "Recipe",
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

    t.nonNull.list.nonNull.field("recipeCategories", {
      type: "RecipeCategory",
      resolve: () => prisma.recipeCategory.findMany(),
    });
  },
});
