import { useAuth0 } from '@auth0/auth0-react';
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { BiListUl } from 'react-icons/bi';
import { GiCook } from 'react-icons/gi';
import { VscAccount } from 'react-icons/vsc';
import { NavLink } from 'react-router-dom';
import { Login } from '../login/Login';

export const TopNavBar = () => {
  const { user } = useAuth0();

  return (
    <div className='flex items-center justify-start pt-3 pb-2 ml-auto'>
      <NavLink
        className='flex flex-row items-center ml-auto mr-5 rounded-full text-white text-sm py-1 px-3 bg-28 hover:bg-23 font-medium uppercase'
        to='/recipes'
      >
        <GiCook className='mr-1' size={16} />
        RECIPES
      </NavLink>
      <NavLink
        className='flex flex-row items-center mr-5 rounded-full text-white text-sm py-1 px-3 bg-28 hover:bg-23 font-medium uppercase'
        to={(location) => {
          const newQueryParams = new URLSearchParams(location.search);
          newQueryParams.append('shoppingList', 'visible');

          return {
            ...location,
            search: newQueryParams.toString(),
          };
        }}
      >
        <BiListUl className='mr-1' size={18} />
        Groceries
      </NavLink>

      <Popover closeOnBlur={true} closeOnEsc={true}>
        <PopoverTrigger>
          <button className='mr-4'>
            {user?.image !== null || undefined ? (
              <img
                className='w-7 h-7 rounded-full'
                src={user?.picture}
                alt=''
              />
            ) : (
              <VscAccount className='text-23' size={22} />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='focus:shadow-none'
          maxWidth='280'
          minWidth='240'
          shadow='lg'
          borderRadius='10px'
        >
          <div className='flex flex-col items-center justify-center my-3 text-14'>
            {user?.image !== null || undefined ? (
              <img
                className='w-14 h-14 rounded-full'
                src={user?.picture}
                alt=''
              />
            ) : (
              <VscAccount className='text-23' size={22} />
            )}
            <span className='mt-2 text-lg font-medium'>
              {user?.name?.includes('@')
                ? user?.email?.substring(0, user.email.lastIndexOf('@'))
                : user?.name}
            </span>
            <span className='mt-1 text-sm'>{user?.email}</span>
            <Login />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
