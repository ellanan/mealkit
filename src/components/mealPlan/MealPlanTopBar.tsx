import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';

export const MealPlanTopBar = (props: {
  today: DateTime;
  interval: DateTime[];
  startDate: DateTime;
  setStartDate: (date: DateTime) => void;
}) => {
  return (
    <div className='flex items-center justify-start'>
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
    </div>
  );
};
