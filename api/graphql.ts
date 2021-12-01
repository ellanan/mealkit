import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as Sentry from '@sentry/node';

import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-cloud-functions';
import { ApolloServerPluginInlineTrace } from 'apollo-server-core';
import jwt from 'jsonwebtoken';

import { schema } from './_helpers/makeSchema';
import { sentryProfilePlugin } from './_helpers/sentryProfilePlugin';
import { prisma } from './_helpers/prismaClient';
import { Handler } from 'express-serve-static-core';
import { instanceId, logger } from './_helpers/logger';

Sentry.init({
  dsn: 'https://ad1bf1ba259c46aea27c96113c2de074@o1044934.ingest.sentry.io/6020188',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    let currentUser = undefined;
    const token = req.headers.authorization?.split(' ')[1];
    const tokenContents =
      token && jwt.verify(token, process.env.AUTH0_PEM as string);
    const authProviderId = tokenContents?.sub as string;

    if (authProviderId) {
      const user = await prisma.user.findUnique({
        where: {
          authProviderId,
        },
      });

      if (user) {
        currentUser = user;
      } else {
        // !!! race condition -- multiple requests may have been sent when a user hasn't been created yet
        try {
          currentUser = await prisma.user.create({
            data: {
              authProviderId: authProviderId,
              mealPlan: {
                create: {},
              },
            },
          });
        } catch (e) {
          if (
            e instanceof PrismaClientKnownRequestError &&
            e.message.includes(
              'Unique constraint failed on the fields: (`authProviderId`)'
            )
          ) {
            // user.create threw an error because another request already created a user with the same authProviderId and email
            currentUser = await prisma.user.findUnique({
              where: {
                authProviderId,
              },
            });
          } else {
            // avoid failing silently for unexpected errors
            throw e;
          }
        }
      }
    }

    return {
      currentUser,
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

const apolloServerHandler = server.createHandler();

const handler: Handler = (req, res, next) => {
  logger.info(`${instanceId}: Handling request ${req.hostname}/${req.url}`);
  apolloServerHandler(req, res, next);
};

export default handler;
