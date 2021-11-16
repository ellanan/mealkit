import { useAuth0 } from '@auth0/auth0-react';
import { IoLogOutOutline } from 'react-icons/io5';

export const Login = () => {
  const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

  return !isAuthenticated ? (
    <button onClick={() => loginWithRedirect()}>login</button>
  ) : (
    <button
      onClick={() => logout()}
      className='font-Raleway flex items-center text-14 text-sm mt-5 px-3 py-1 rounded-full border-1 hover:bg-gray-400 hover:text-white hover:rounded-full'
    >
      <IoLogOutOutline className='mr-2' />
      Log Out
    </button>
  );
};
