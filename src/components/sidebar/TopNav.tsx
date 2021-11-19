import { NavLink } from 'react-router-dom';
import { BiListUl } from 'react-icons/bi';
import { MdCreate } from 'react-icons/md';
import { GoSearch } from 'react-icons/go';

import { ReactComponent as CarrotLogo } from '../../images/logo-carrot.svg';

export const TopNav = () => {
  return (
    <div className='flex flex-col items-center justify-center bg-24 h-full pt-4 font-Raleway'>
      <NavLink
        to='/'
        className='text-lg font-medium text-23 font-Montserrat flex mb-8'
      >
        <CarrotLogo className='w-5 mr-1.5' />
        MealKit
      </NavLink>

      <div className='flex items-center justify-center'>
        <NavLink
          className='mr-5 rounded-full text-white py-2 px-2 bg-28 hover:bg-23'
          to='/recipes'
        >
          <GoSearch size={20} />
        </NavLink>

        <NavLink
          className='mr-5 rounded-full text-white py-2 px-2 bg-28 hover:bg-23'
          to={(location) => {
            const newQueryParams = new URLSearchParams(location.search);
            newQueryParams.append('modalCreateRecipe', 'visible');

            return {
              ...location,
              search: newQueryParams.toString(),
            };
          }}
        >
          <MdCreate size={20} />
        </NavLink>

        <NavLink
          className='rounded-full text-white py-2 px-2 bg-28 hover:bg-23'
          to={(location) => {
            const newQueryParams = new URLSearchParams(location.search);
            newQueryParams.append('shoppingList', 'visible');

            return {
              ...location,
              search: newQueryParams.toString(),
            };
          }}
        >
          <BiListUl size={20} />
        </NavLink>
      </div>
    </div>
  );
};
