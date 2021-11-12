import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { BrowserRouter } from 'react-router-dom';

import { CustomEmotionCacheProvider } from './utils/CustomEmotionCacheProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloClientProvider } from './ApolloClientProvider';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';
import { AuthAccessTokenProvider } from './useAuthAccessTokenContext';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <CustomEmotionCacheProvider>
        <Auth0Provider
          domain={process.env.REACT_APP_AUTH0_DOMAIN as string}
          clientId={process.env.REACT_APP_AUTH0_CLIENT_ID as string}
          redirectUri={window.location.origin}
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
  document.getElementById('root')
);
