import * as Sentry from '@sentry/node';
import { Handler } from 'express-serve-static-core';
import { apolloServerInstance } from './_helpers/apolloServerInstance';
import { instanceId, logger } from './_helpers/logger';

Sentry.init({
  dsn: 'https://ad1bf1ba259c46aea27c96113c2de074@o1044934.ingest.sentry.io/6020188',

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
