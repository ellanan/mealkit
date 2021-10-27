import { NavLink } from 'react-router-dom';

import { Recipes } from '../pages/Recipes';
import { Footer } from './Footer';

export const Sidebar = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-24 h-full pt-4 font-Raleway'>
      <NavLink to='/'>
        <h1 className='text-lg font-medium text-23 font-Montserrat'>MealKit</h1>
      </NavLink>
      <div className='flex flex-col overflow-hidden'>
        <Recipes />
      </div>
      <ul className='flex flex-col items-center justify-end w-full font-medium'>
        {/* <Li>
          <NavLink
            className='h-full mt-auto'
            to='/login'
            activeClassName='active'
          >
            Login
          </NavLink>
        </Li> */}
      </ul>
      <Footer />
    </div>
  );
};
