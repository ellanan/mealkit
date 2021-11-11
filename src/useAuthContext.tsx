import {
  useEffect,
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react';
import {
  GoogleLoginResponse,
  useGoogleLogin,
  useGoogleLogout,
} from 'react-google-login';

const AuthContext = createContext<ReturnType<typeof useAuth> | null>(null);

export const AuthContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const userData = useAuth();

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within a AuthContextProvider');
  }
  return context;
};

const useAuth = () => {
  const [googleLoginResponse, setGoogleLoginResponse] =
    useState<GoogleLoginResponse>();
  const [accessToken, setAccessToken] = useState<string>();

  const email = googleLoginResponse?.profileObj.email.toLowerCase();

  const { signIn, loaded } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
    onSuccess: (response) => {
      // setRefreshToken(response.code)

      if ('accessToken' in response) {
        console.log('accessToken in response', response);
        setGoogleLoginResponse(response);
        setAccessToken(response.accessToken);
      }
    },
    onFailure: (response) => {
      throw new Error(JSON.stringify(response));
    },
    isSignedIn: true,
    cookiePolicy: 'single_host_origin',
  });

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string,
    redirectUri: '/login',
    onLogoutSuccess: () => setGoogleLoginResponse(undefined),
  });

  useEffect(() => {
    // reload auth response every minute before it expires
    const interval = setInterval(async () => {
      const authResponse = await googleLoginResponse?.reloadAuthResponse();
      if (!authResponse) {
        throw new Error(`Errored trying to refresh auth.`);
      }
      setAccessToken(authResponse.access_token);
    }, 1_000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, [googleLoginResponse]);


  return {
    isLoggedIn: !!googleLoginResponse,
    isLoggingIn: !loaded,
    email,
    signIn,
    signOut,
    loaded,
    accessToken,
    googleLoginResponse,
    setGoogleLoginResponse,
  };
};
