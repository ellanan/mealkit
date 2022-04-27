import { useAuth0 } from '@auth0/auth0-react';
import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';

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

const AuthAccessTokenContext = createContext<ReturnType<
  typeof useAuthAccessToken
> | null>(null);

export const AuthAccessTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { accessToken, isGettingAccessToken } = useAuthAccessToken();
  return (
    <AuthAccessTokenContext.Provider
      value={{ accessToken, isGettingAccessToken }}
    >
      {children}
    </AuthAccessTokenContext.Provider>
  );
};

export const useAuthAccessTokenContext = () => {
  const context = useContext(AuthAccessTokenContext);
  if (context === null) {
    throw new Error(
      'useAuthAccessTokenContext must be used within a AuthAccessTokenProvider'
    );
  }
  return context;
};
