import { useAuth0 } from '@auth0/auth0-react';
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { VscAccount } from 'react-icons/vsc';
import { RiUserSettingsLine } from 'react-icons/ri';

import { ShareMealPlan } from '../shareMealPlan/ShareMealPlan';
import { ClearAllMealPlanEntries } from '../mealPlan/ClearAllMealPlanEntries';
import { Login } from '../login/Login';

export const Setting = () => {
  const { user } = useAuth0();

  return (
    <div className='flex items-center justify-center pt-3 pb-5'>
      <Popover closeOnBlur={true} closeOnEsc={true}>
        <PopoverTrigger>
          <button className='rounded-full text-white py-2 px-2 bg-28 hover:bg-23'>
            <RiUserSettingsLine size={20} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='focus:shadow-none'
          maxWidth='280'
          minWidth='240'
          shadow='lg'
          borderRadius='10px'
        >
          <div className='flex flex-col items-center justify-center my-6 text-14'>
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
            <ShareMealPlan />
            <ClearAllMealPlanEntries />
            <Login />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
