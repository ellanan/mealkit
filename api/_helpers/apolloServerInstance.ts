import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-cloud-functions';
import {
  ApolloServerPluginInlineTrace,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import jwt from 'jsonwebtoken';
import { schema } from './makeSchema';
import { prisma } from './prismaClient';
import { sentryPlugin } from './sentryPlugin';

export const apolloServerInstance = new ApolloServer({
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
            e instanceof Error &&
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
    sentryPlugin,
  ].concat(
    process.env.TRACE_GRAPHQL === 'true' ? ApolloServerPluginInlineTrace() : []
  ),
});
