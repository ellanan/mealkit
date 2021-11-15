import { useAuth0 } from '@auth0/auth0-react';
import { IoLogOutOutline } from 'react-icons/io5';

export const Login = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return !isAuthenticated ? (
    <button onClick={() => loginWithRedirect()}>login</button>
  ) : (
    <button
      onClick={() => logout()}
      className='flex items-center hover:bg-21 text-white text-sm bg-17 rounded-2xl mt-2 px-3 py-1'
    >
      <IoLogOutOutline className='mr-2' />
      Log Out
    </button>
  );
};
