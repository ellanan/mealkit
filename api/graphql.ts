import * as Sentry from '@sentry/node';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';

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
  ].concat(
    process.env.TRACE_GRAPHQL === 'true' ? ApolloServerPluginInlineTrace() : []
  ),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default server.createHandler();
