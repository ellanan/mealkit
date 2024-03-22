import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BrowserRouter } from "react-router-dom";

import { CustomEmotionCacheProvider } from "./utils/CustomEmotionCacheProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { ApolloClientProvider } from "./ApolloClientProvider";
import { Auth0Provider } from "@auth0/auth0-react";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import App from "./App";
import { AuthAccessTokenProvider } from "./useAuthAccessTokenContext";

// Sentry.init({
//   dsn: "https://167a2028956748cc8305c55cb9f948e8@o1044934.ingest.sentry.io/6081450",
//   integrations: [new Integrations.BrowserTracing()],

//   // Set tracesSampleRate to 1.0 to capture 100%
//   // of transactions for performance monitoring.
//   // We recommend adjusting this value in production
//   tracesSampleRate: 1.0,
//   environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
// });

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <CustomEmotionCacheProvider>
        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
          redirectUri={window.location.origin}
          audience={import.meta.env.VITE_AUTH0_AUDIENCE}
          cacheLocation="localstorage"
        >
          <AuthAccessTokenProvider>
            <ApolloClientProvider>
              <ChakraProvider>
                <App />
              </ChakraProvider>
            </ApolloClientProvider>
          </AuthAccessTokenProvider>
        </Auth0Provider>
      </CustomEmotionCacheProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
