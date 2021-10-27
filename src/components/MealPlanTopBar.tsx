import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { DateTime } from 'luxon';

export const MealPlanTopBar = (props: {
  today: DateTime;
  interval: DateTime[];
  startDate: DateTime;
  setStartDate: (date: DateTime) => void;
}) => {
  return (
    <div className='flex items-center justify-start pt-4'>
      <Button
        className='text-11 my-0 mx-4 ounded-full border-solid focus:shadow-none hover:bg-12'
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
        className='ml-auto mr-8 rounded-full text-13 text-sm py-1 px-2 border border-13'
        to={(location) => {
          const newQueryParams = new URLSearchParams(location.search);
          newQueryParams.append('shoppingList', 'visible');

          return {
            ...location,
            search: newQueryParams.toString(),
          };
        }}
      >
        Shopping List
      </NavLink>
    </div>
  );
};
