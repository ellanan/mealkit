import { enumType, makeSchema } from 'nexus';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import { join } from 'path';
import * as mutationTypes from '../_graphqlTypes/Mutation';
import * as queryTypes from '../_graphqlTypes/Query';

export const schema = makeSchema({
  types: [
    GraphQLDate,
    GraphQLDateTime,
    enumType({
      name: 'Order',
      members: ['desc', 'asc'],
    }),
    ...Object.values(queryTypes),
    ...Object.values(mutationTypes),
  ],
  outputs: {
    typegen: join(process.cwd(), 'generated', 'nexus-typegen.d.ts'),
    schema: join(process.cwd(), 'generated', 'schema.graphql'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
  contextType: {
    module: join(process.cwd(), 'api', '_helpers', 'contextModule.ts'),
    alias: 'ContextModule',
    export: 'Context',
  },
});
