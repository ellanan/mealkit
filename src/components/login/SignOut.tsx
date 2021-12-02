import { useAuth0 } from '@auth0/auth0-react';
import { IoLogOutOutline } from 'react-icons/io5';

export const SignOut = () => {
  const { isAuthenticated, logout } = useAuth0();

  return isAuthenticated ? (
    <button
      className='font-Raleway flex items-center text-14 text-sm mt-5 px-3 py-1 rounded-full border-1 hover:bg-gray-400 hover:text-white hover:rounded-full'
      onClick={() => logout()}
    >
      <IoLogOutOutline className='mr-2' />
      Sign Out
    </button>
  ) : null;
};
