import { useAuth0 } from '@auth0/auth0-react';
import { useMediaQuery } from '@chakra-ui/react';
import { IoLogOutOutline } from 'react-icons/io5';

import { Home } from '../home/Home';
import { MobileHome } from '../mobile/MobileHome';

export const Login = () => {
  const { isAuthenticated, logout } = useAuth0();

  const [isLargerthan850] = useMediaQuery('(min-width: 850px)');

  return !isAuthenticated ? (
    isLargerthan850 ? (
      <Home />
    ) : (
      <MobileHome />
    )
  ) : (
    <button
      onClick={() => logout()}
      className='font-Raleway flex items-center text-14 text-sm mt-5 px-3 py-1 rounded-full border-1 hover:bg-gray-400 hover:text-white hover:rounded-full'
    >
      <IoLogOutOutline className='mr-2' />
      Sign Out
    </button>
  );
};
