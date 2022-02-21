// referenced https://blog.sentry.io/2021/08/31/guest-post-performance-monitoring-in-graphql

import { ApolloServerPlugin } from 'apollo-server-plugin-base';
import { Context } from './contextModule';

export const sentryProfilePlugin: ApolloServerPlugin<Context> = {
  // @ts-ignore
  requestDidStart({ request, context }) {
    if (!!request.operationName) {
      // set the transaction Name if we have named queries
      context.transaction.setName(request.operationName!);
    }
    return {
      // @ts-ignore
      willSendResponse({ context }) {
        // hook for transaction finished
        context.transaction.finish();
      },
      executionDidStart() {
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
    };
  },
};
