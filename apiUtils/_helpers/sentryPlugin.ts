// referenced https://blog.sentry.io/2021/08/31/guest-post-performance-monitoring-in-graphql
// and https://codesandbox.io/s/graphql-errors-sentry-apollo-5s8yu?file=/index.ts
import * as Sentry from '@sentry/node';
import { ApolloError } from 'apollo-server-cloud-functions';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

import { Context } from './contextModule';

export const sentryPlugin: ApolloServerPlugin<Context> = {
  // @ts-ignore
  requestDidStart({ request, context }) {
    if (request.operationName) {
      // set the transaction Name if we have named queries
      context.transaction.setName(request.operationName!);
    }
    const requestListener: GraphQLRequestListener<Context> = {
      async willSendResponse({ context }) {
        // hook for transaction finished
        context.transaction.finish();
      },
      async executionDidStart() {
        return {
          // @ts-ignore
          willResolveField({ context, info }) {
            // hook for each new resolver
            const span = context.transaction.startChild({
              op: 'resolver',
              description: `${info.parentType.name}.${info.fieldName}`,
            });
            return () => {
              // this will execute once the resolver is finished
              span.finish();
            };
          },
        };
      },
      async didEncounterErrors(ctx) {
        // If we couldn't parse the operation, don't
        // do anything here
        if (!ctx.operation) {
          return;
        }

        for (const err of ctx.errors) {
          // Only report internal server errors,
          // all errors extending ApolloError should be user-facing
          if (err instanceof ApolloError) {
            continue;
          }

          // Add scoped report details and send to Sentry
          Sentry.withScope((scope) => {
            // Annotate whether failing operation was query/mutation/subscription
            scope.setTag('kind', ctx.operation?.operation);

            // Log query and variables as extras (make sure to strip out sensitive data!)
            scope.setExtra('query', ctx.request.query);
            scope.setExtra('variables', ctx.request.variables);

            if (err.path) {
              // We can also add the path as breadcrumb
              scope.addBreadcrumb({
                category: 'query-path',
                message: err.path.join(' > '),
                level: Sentry.Severity.Debug,
              });
            }

            const transactionId =
              ctx.request.http?.headers.get('x-transaction-id');
            if (transactionId) {
              scope.setTransactionName(transactionId);
            }

            Sentry.captureException(err);
          });
        }
      },
    };

    return requestListener;
  },
};
