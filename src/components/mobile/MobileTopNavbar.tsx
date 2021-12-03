import { NavLink } from 'react-router-dom';

import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';
import { Setting } from '../sidebar/Setting';

export const MobileTopNavbar = () => {
  return (
    <div className='font-Raleway flex items-center justify-start bg-24 py-3 px-4'>
      <NavLink
        to='/mealplanner'
        className='text-lg font-medium text-23 font-Montserrat flex h-5'
      >
        <CarrotLogo className='w-5 h-5 mr-1.5' />
        MealKit
      </NavLink>
      <Setting />
    </div>
  );
};
