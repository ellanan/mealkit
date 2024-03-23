import * as Sentry from "@sentry/node";

// Importing @sentry/tracing patches the global hub for tracing to work.
import "@sentry/tracing";
import { apolloServerHandler } from "../apiUtils/_helpers/apolloServerInstance";

Sentry.init({
  dsn: "https://0a2d5cbd59aa44cbbde11aa7b1950e86@o1044934.ingest.sentry.io/6261009",
  environment: process.env.VITE_SENTRY_ENVIRONMENT,

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

export { apolloServerHandler as GET, apolloServerHandler as POST };
