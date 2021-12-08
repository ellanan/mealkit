import { useAuth0 } from '@auth0/auth0-react';
import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/react';
import { VscAccount } from 'react-icons/vsc';
import { RiUserSettingsLine } from 'react-icons/ri';
import { useMediaQuery } from '@chakra-ui/react';

import { ShareMealPlan } from '../shareMealPlan/ShareMealPlan';
import { ClearAllMealPlanEntries } from '../mealPlan/ClearAllMealPlanEntries';
import { SignOut } from '../login/SignOut';

export const Setting = () => {
  const { user } = useAuth0();

  const [isLargerThan850] = useMediaQuery('(min-width: 850px)');

  return (
    <div
      className={
        isLargerThan850
          ? 'flex items-center justify-center pt-3 pb-5'
          : 'ml-auto'
      }
    >
      <Popover closeOnBlur={true} closeOnEsc={true}>
        <PopoverTrigger>
          <button className='rounded-full text-white py-2 px-2 bg-28 transition-all duration-150 hover:scale-110'>
            <RiUserSettingsLine size={isLargerThan850 ? 20 : 16} />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='focus:shadow-none'
          maxWidth='260'
          minWidth='240'
          shadow='lg'
          borderRadius='10px'
        >
          <div className='flex flex-col items-center justify-center my-6 text-14'>
            {user?.image !== null || undefined ? (
              <img
                className={
                  isLargerThan850
                    ? 'w-14 h-14 rounded-full'
                    : 'w-12 h-12 rounded-full'
                }
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
          </div>
          <ShareMealPlan />
          <ClearAllMealPlanEntries />
          <SignOut />
        </PopoverContent>
      </Popover>
    </div>
  );
};
