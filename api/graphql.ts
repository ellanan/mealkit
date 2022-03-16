import * as Sentry from '@sentry/node';
// Importing @sentry/tracing patches the global hub for tracing to work.
import '@sentry/tracing';
import { Handler } from 'express-serve-static-core';
import { apolloServerInstance } from './_helpers/apolloServerInstance';
import { instanceId, logger } from './_helpers/logger';

Sentry.init({
  dsn: 'https://0a2d5cbd59aa44cbbde11aa7b1950e86@o1044934.ingest.sentry.io/6261009',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServerHandler = apolloServerInstance.createHandler();

const handler: Handler = (req, res, next) => {
  logger.info(`${instanceId}: Handling request ${req.url}`);
  apolloServerHandler(req, res, next);
};

export default handler;
