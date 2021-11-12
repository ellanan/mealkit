import _ from 'lodash';
import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuthAccessTokenContext } from './useAuthAccessTokenContext';

export const ApolloClientProvider = ({ children }: PropsWithChildren<{}>) => {
  const { accessToken } = useAuthAccessTokenContext();
  const accessTokenRef = useRef<string | undefined>();
  useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const apolloClient = useMemo(() => {
    const httpLink = createHttpLink({
      uri: '/api/graphql',
    });

    const authLink = setContext((__, { headers }) => {
      const token = accessTokenRef.current;
      return {
        headers: _.omitBy(
          {
            ...headers,
            authorization: token ? `Bearer ${token}` : undefined,
          },
          _.isNil
        ),
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [accessTokenRef]);

  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
};
