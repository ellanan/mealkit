import { useAuth0 } from '@auth0/auth0-react';
import { IoLogOutOutline } from 'react-icons/io5';

export const SignOut = () => {
  const { isAuthenticated, logout } = useAuth0();

  return isAuthenticated ? (
    <button
      className='font-Raleway flex items-center text-14 text-sm pl-4 py-2 mb-2 hover:bg-12'
      onClick={() => logout()}
    >
      <IoLogOutOutline size={15} className='min-w-[20px] mr-2' />
      Sign Out
    </button>
  ) : null;
};
