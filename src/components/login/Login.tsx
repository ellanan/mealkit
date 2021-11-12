import { useAuth0 } from '@auth0/auth0-react';

export const Login = () => {
  const { loginWithRedirect, isAuthenticated, logout, isLoading } = useAuth0();

  if (isLoading) return <>loading...</>;

  return !isAuthenticated ? (
    <button onClick={() => loginWithRedirect()}>login</button>
  ) : (
    <button onClick={() => logout()}>log out</button>
  );
};

export const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  return isAuthenticated ? <div>{user?.name}</div> : null;
};
