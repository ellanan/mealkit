import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import * as Sentry from "@sentry/node";
import { InigoPlugin } from "inigo.js";
import jwt from "jsonwebtoken";
import type { Headers } from "undici";

import { schema } from "./makeSchema";
import { prisma } from "./prismaClient";

export const apolloServerInstance = new ApolloServer({
  schema,
  plugins: [InigoPlugin()],
});

export const apolloServerHandler = startServerAndCreateNextHandler(
  apolloServerInstance,
  {
    context: async (req) => {
      let currentUser = undefined;

      /**
       * XXX: the req that's actually returned at runtime is a Map of `HeadersList`,
       * but since we're using @as-integrations/next, it's returning the wrong type.
       * Should either migrate the project to next.js, or make an apollo-server integration
       * specifically for Vercel
       */
      const headers = req.headers as unknown as Headers;

      const token = headers.get("authorization")?.split(" ")[1];
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
                "Unique constraint failed on the fields: (`authProviderId`)",
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
          op: "gql",
          name: "DefaultGraphQLTransaction", // this will be the default name, unless the gql query has a name
        }),
      };
    },
  },
);
