import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CustomEmotionCacheProvider } from './utils/CustomEmotionCacheProvider';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloClientProvider } from './ApolloClientProvider';
import { AuthContextProvider } from './useAuthContext';

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <CustomEmotionCacheProvider>
        <AuthContextProvider>
          <ApolloClientProvider>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </ApolloClientProvider>
        </AuthContextProvider>
      </CustomEmotionCacheProvider>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
