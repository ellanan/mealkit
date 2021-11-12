import { useAuth0 } from '@auth0/auth0-react';
import constate from 'constate';
import { useEffect, useState } from 'react';

const useAuthAccessToken = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState<string>();

  const [isGettingAccessToken, setIsGettingAccessToken] =
    useState<boolean>(false);
  useEffect(() => {
    if (isAuthenticated) {
      setIsGettingAccessToken(true);
      getAccessTokenSilently().then((accessToken) => {
        setIsGettingAccessToken(false);
        setAccessToken(accessToken);
      });
    } else {
      setAccessToken(undefined);
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  return {
    accessToken,
    isGettingAccessToken: isLoading || isGettingAccessToken,
  };
};

export const [AuthAccessTokenProvider, useAuthAccessTokenContext] =
  constate(useAuthAccessToken);
