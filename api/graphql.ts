import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import cors from 'micro-cors';
import { send } from 'micro';

import { Context } from './contextModule';
import { schema } from './_helpers/makeSchema';

const server = new ApolloServer({
  schema,
  context: (): Context => {
    return {
      currentUser: {
        id: 'ckuk47cjl0000u7rzs57upv7s',
      },
    };
  },
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
