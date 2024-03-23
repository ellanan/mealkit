import { objectType } from 'nexus';

export const IngredientType = objectType({
  name: 'IngredientType',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.string('name');
  },
});
