import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import { makeSchema } from 'nexus';
import { join } from 'path';
import * as mutationTypes from './graphqlTypes/mutationTypes';
import * as queryTypes from './graphqlTypes/queryTypes';

const schema = makeSchema({
  types: [...Object.values(queryTypes), ...Object.values(mutationTypes)],
  outputs: {
    typegen: join(__dirname, '..', 'nexus-typegen.ts'), // 2
    schema: join(__dirname, '..', 'schema.graphql'), // 3
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
export default server.start().then(() =>
  server.createHandler({
    path: '/api/graphql',
  })
);
