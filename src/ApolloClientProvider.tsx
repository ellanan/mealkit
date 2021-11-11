import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuthContext } from './useAuthContext';

export const ApolloClientProvider = ({ children }: PropsWithChildren<{}>) => {
  const { accessToken } = useAuthContext();
  const accessTokenRef = useRef<string | undefined>();

  const apolloClient = useMemo(() => {
    const httpLink = createHttpLink({
      uri: '/api/graphql',
    });

    const authLink = setContext((_, { headers }) => {
      const token = accessTokenRef.current;
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : undefined,
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [accessTokenRef]);

  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
