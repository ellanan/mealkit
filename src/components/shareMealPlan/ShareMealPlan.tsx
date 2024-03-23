import { BiShareAlt } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

export const ShareMealPlan = () => {
  return (
    <div className='flex flex-col'>
      <NavLink
        className='flex items-center justify-center text-14 text-sm py-2 hover:bg-12'
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
