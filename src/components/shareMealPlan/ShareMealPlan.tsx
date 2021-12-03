import { BiShareAlt } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

export const ShareMealPlan = () => {
  return (
    <div className='flex flex-col'>
      <NavLink
        className='font-Raleway flex items-center text-14 text-sm pl-4 py-2 hover:bg-12'
        to={(location) => {
          const newQueryParams = new URLSearchParams(location.search);
          newQueryParams.append('modalShareMealPlan', 'visible');

          return {
            ...location,
            search: newQueryParams.toString(),
          };
        }}
      >
        <BiShareAlt size={14} className='min-w-[20px] mr-2' />
        Share Meal Plan
      </NavLink>
    </div>
  );
};
