import { objectType } from "nexus";
import { prisma } from "../_helpers/prismaClient";

export const User = objectType({
  name: "User",
  definition(t) {
    t.nonNull.id("id");
    t.string("username");
    t.string("email");
    t.nonNull.list.field("recipes", {
      type: "Recipe",
      async resolve(parent) {
        const userId = parent.id;
        return prisma.recipe.findMany({
          where: {
            user: {
              is: {
                id: userId,
              },
            },
          },
        });
      },
    });
    t.field("mealPlan", {
      type: "MealPlan",
      resolve(parent) {
        return prisma.user
          .findUnique({
            where: {
              id: parent.id,
            },
            include: {
              mealPlan: true,
            },
          })
          .then((user) => user!.mealPlan);
      },
    });
  },
});
