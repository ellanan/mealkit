import { useAuth0 } from '@auth0/auth0-react';
import constate from 'constate';
import { useCallback, useEffect, useState } from 'react';

const useAuthAccessToken = () => {
  const {
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0();
  const [accessToken, setAccessToken] = useState<string>();

  const [isGettingAccessToken, setIsGettingAccessToken] =
    useState<boolean>(false);

  const trySetAccessToken = useCallback(
    async function getAccessToken() {
      if (isAuthenticated) {
        setIsGettingAccessToken(true);
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token);
          setIsGettingAccessToken(false);
        } catch (e) {
          if (e === 'login_required') {
            loginWithRedirect();
          } else if (e === 'consent_required') {
            loginWithRedirect();
          } else {
            setAccessToken(undefined);
            throw e;
          }
        }
      }
    },
    [getAccessTokenSilently, isAuthenticated, loginWithRedirect]
  );

  useEffect(() => {
    trySetAccessToken();
  }, [trySetAccessToken]);

  return {
    accessToken,
    isGettingAccessToken: isLoading || isGettingAccessToken,
  };
};

export const [AuthAccessTokenProvider, useAuthAccessTokenContext] =
  constate(useAuthAccessToken);
