import { useAuth0 } from '@auth0/auth0-react';
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { VscAccount } from 'react-icons/vsc';
import { RiUserSettingsLine } from 'react-icons/ri';

import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';
import { ClearAllMealPlanEntries } from '../mealPlan/ClearAllMealPlanEntries';
import { Login } from '../login/Login';

export const MobileTopNavbar = () => {
  const { user } = useAuth0();

  return (
    <div className='flex items-center justify-start bg-24 py-3 px-4 font-Raleway'>
      <NavLink
        to='/'
        className='text-lg font-medium text-23 font-Montserrat flex h-5'
      >
        <CarrotLogo className='w-5 h-5 mr-1.5' />
        MealKit
      </NavLink>

      <div className='ml-auto'>
        <Popover closeOnBlur={true} closeOnEsc={true}>
          <PopoverTrigger>
            <button className='rounded-full text-white py-2 px-2 bg-28 hover:bg-23'>
              <RiUserSettingsLine size={16} />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className='focus:shadow-none'
            maxWidth='280'
            minWidth='240'
            minHeight='180'
            shadow='lg'
            borderRadius='10px'
          >
            <div className='flex flex-col items-center justify-center my-6 text-14'>
              {user?.image !== null || undefined ? (
                <img
                  className='w-12 h-12 rounded-full'
                  src={user?.picture}
                  alt=''
                />
              ) : (
                <VscAccount className='text-23' />
              )}
              <span className='mt-2 text-lg font-medium'>
                {user?.name?.includes('@')
                  ? user?.email?.substring(0, user.email.lastIndexOf('@'))
                  : user?.name}
              </span>
              <span className='mt-1 text-sm'>{user?.email}</span>
              <ClearAllMealPlanEntries />
              <Login />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
