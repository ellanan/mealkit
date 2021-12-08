import { NavLink } from 'react-router-dom';
import { MdCreate } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';
import { AiOutlineHome } from 'react-icons/ai';
import { Tooltip } from '@chakra-ui/react';

import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';

export const TopNav = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full pt-4 font-Raleway'>
      <NavLink
        to='/mealplanner'
        className='text-lg font-medium text-23 font-Montserrat flex mb-8 h-5'
      >
        <CarrotLogo className='w-5 h-5 mr-1.5' />
        MealKit
      </NavLink>

      <div className='flex items-center justify-center'>
        <NavLink
          className='mr-5 rounded-full text-white py-2 px-2 bg-28 transition-all duration-150 hover:scale-110'
          activeStyle={{ backgroundColor: '#fa9d6e' }}
          exact
          to='/mealplanner'
        >
          <AiOutlineHome size={20} />
        </NavLink>

        <NavLink
          className='mr-5 rounded-full text-white py-2 px-2 bg-28 transition-all duration-150 hover:scale-110'
          activeStyle={{ backgroundColor: '#fa9d6e' }}
          exact
          to='/recipes'
        >
          <Tooltip
            label='search for recipes'
            className='bg-gray-400 bg-opacity-90 p-2 font-Raleway'
          >
            <span>
              <GoSearch size={20} />
            </span>
          </Tooltip>
        </NavLink>

        <NavLink
          className='rounded-full text-white py-2 px-2 bg-28 transition-all duration-150 hover:scale-110'
          activeStyle={{ backgroundColor: '#fa9d6e' }}
          isActive={(match, location) => {
            return location.search.includes('modalCreateRecipe=visible');
          }}
          to={(location) => {
            const newQueryParams = new URLSearchParams(location.search);
            newQueryParams.append('modalCreateRecipe', 'visible');

            return {
              ...location,
              search: newQueryParams.toString(),
            };
          }}
        >
          <Tooltip
            label='create a new recipe'
            className='bg-gray-400 bg-opacity-90 p-2 font-Raleway'
          >
            <span>
              <MdCreate size={20} />
            </span>
          </Tooltip>
        </NavLink>
      </div>
    </div>
  );
};
