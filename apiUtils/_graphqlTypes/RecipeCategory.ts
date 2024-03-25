import { objectType } from "nexus";

export const RecipeCategory = objectType({
  name: "RecipeCategory",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.string("name");
  },
});
