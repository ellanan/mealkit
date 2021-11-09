import { NavLink } from 'react-router-dom';

import { PopularRecipes } from '../recipe/PopularRecipes';
import { Recipes } from '../recipe/Recipes';
import { Footer } from '../footer/Footer';
import { ReactComponent as CarrotLogo } from './images/logo-carrot.svg';

export const Sidebar = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-24 h-full pt-4 font-Raleway'>
      <NavLink
        to='/'
        className='text-lg font-medium text-23 font-Montserrat flex'
      >
        <CarrotLogo className='w-5 mr-1.5' />
        MealKit
      </NavLink>
      <PopularRecipes />
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
