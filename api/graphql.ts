import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import cors from 'micro-cors';
import { send } from 'micro';

import { makeSchema } from 'nexus';
import { join } from 'path';
import * as mutationTypes from './graphqlTypes/mutationTypes';
import * as queryTypes from './graphqlTypes/queryTypes';

const schema = makeSchema({
  types: [...Object.values(queryTypes), ...Object.values(mutationTypes)],
  outputs: {
    typegen: join(process.cwd(), 'generated', 'nexus-typegen.d.ts'),
    schema: join(process.cwd(), 'generated', 'schema.graphql'),
  },
  sourceTypes: {
    modules: [{ module: '.prisma/client', alias: 'PrismaClient' }],
  },
});

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// eslint-disable-next-line import/no-anonymous-default-export
export default server.start().then(() => {
  const handler = server.createHandler({
    path: '/api/graphql',
  });
  return cors()((req, res) =>
    req.method === 'OPTIONS' ? send(res, 200, 'ok') : handler(req, res)
  );
});
