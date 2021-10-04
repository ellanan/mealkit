import { PrismaClient } from '@prisma/client';
import { idArg, mutationType, stringArg } from 'nexus';

const prisma = new PrismaClient();

export const Mutation = mutationType({
  definition(t) {
    t.field('createIngredient', {
      type: 'Ingredient',
      args: {
        name: stringArg({
          description: 'name of the newly created ingredient',
        }),
        ingredientTypeId: idArg({
          description: 'id of the ingredient type',
        }),
      },
      async resolve(parent, args, context) {
        return prisma.ingredient.create({
          data: {
            name: args.name,
            ingredientType: {
              connect: {
                id: Number(args.ingredientTypeId),
              },
            },
          },
        });
      },
    });

    t.field('createIngredientType', {
      type: 'IngredientType',
    });
  },
});
