import * as Sentry from '@sentry/node';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import cors from 'micro-cors';
import { send } from 'micro';

import { Context } from './contextModule';
import { schema } from './_helpers/makeSchema';
import { sentryProfilePlugin } from './_helpers/sentryProfilePlugin';

Sentry.init({
  dsn: 'https://ad1bf1ba259c46aea27c96113c2de074@o1044934.ingest.sentry.io/6020188',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const server = new ApolloServer({
  schema,
  context: (): Context => {
    return {
      currentUser: {
        id: 'ckuk47cjl0000u7rzs57upv7s',
      },
      transaction: Sentry.startTransaction({
        op: 'gql',
        name: 'DefaultGraphQLTransaction', // this will be the default name, unless the gql query has a name
      }),
    };
  },
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground,
    sentryProfilePlugin,
  ],
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
