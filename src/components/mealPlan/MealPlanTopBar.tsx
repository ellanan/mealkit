import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';
import { BiListUl } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';

export const MealPlanTopBar = (props: {
  today: DateTime;
  interval: DateTime[];
  startDate: DateTime;
  setStartDate: (date: DateTime) => void;
}) => {
  return (
    <div className='flex items-center justify-start mt-4'>
      <Button
        className='text-11 my-0 mx-5 rounded-full border-solid focus:shadow-none hover:bg-12'
        onClick={(e) => {
          e.preventDefault();
          props.setStartDate(props.today.startOf('week'));
        }}
        size={'sm'}
      >
        Today
      </Button>

      <Button
        className='bg-white text-11 rounded-full h-7 w-4 focus:shadow-none hover:bg-12'
        onClick={() => {
          props.setStartDate(props.startDate.minus({ weeks: 1 }));
        }}
      >
        <ChevronLeftIcon w={6} h={6} />
      </Button>

      <Button
        className='bg-white text-11 rounded-full h-7 w-4 focus:shadow-none hover:bg-12'
        onClick={() => {
          props.setStartDate(props.startDate.plus({ weeks: 1 }));
        }}
      >
        <ChevronRightIcon w={6} h={6} />
      </Button>

      <span className='flex items-center justify-start text-13 my-0 mx-6 font-medium text-xl'>
        {`${props.interval[0].monthLong} ${props.interval[0].year}`}
      </span>

      <NavLink
        className='flex flex-row items-center ml-auto mr-5 rounded-full text-white text-sm py-1 px-3 bg-28 hover:bg-23 font-medium uppercase'
        to={(location) => {
          const newQueryParams = new URLSearchParams(location.search);
          newQueryParams.append('shoppingList', 'visible');

          return {
            ...location,
            search: newQueryParams.toString(),
          };
        }}
      >
        <BiListUl className='mr-1' size={18} />
        Groceries
      </NavLink>
    </div>
  );
};
