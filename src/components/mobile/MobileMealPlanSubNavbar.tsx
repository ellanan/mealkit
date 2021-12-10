/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Button } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { DateTime } from 'luxon';

export const MobileMealPlanSubNavbar = (props: {
  today: DateTime;
  interval: DateTime[];
  startDate: DateTime;
  setStartDate: (date: DateTime) => void;
}) => {
  return (
    <div
      className='z-20 transition fixed top-14 flex items-center justify-start p-2 w-full'
      css={css`
        .scrolling-down & {
          transform: translateY(-100%);
          opacity: 0;
        }

        background-color: #ffffffce;
        backdrop-filter: blur(10px) saturate(100%) contrast(45%)
          brightness(130%);
      `}
    >
      <Button
        className='text-11 ml-4 mr-1 rounded-full border-solid focus:shadow-none hover:bg-12'
        onClick={(e) => {
          e.preventDefault();
          props.setStartDate(props.today.startOf('day'));
        }}
        size={'sm'}
      >
        Today
      </Button>

      <Button
        className=' text-11 rounded-full h-7 w-4 focus:shadow-none'
        variant='ghost'
        onClick={() => {
          props.setStartDate(props.startDate.minus({ weeks: 1 }));
        }}
      >
        <ChevronLeftIcon w={6} h={6} />
      </Button>

      <span className='flex items-center justify-start text-13 font-medium text-lg'>
        {`${props.interval[0].monthLong} ${props.interval[0].year}`}
      </span>

      <Button
        className=' text-11 rounded-full h-7 w-4 focus:shadow-none'
        variant='ghost'
        onClick={() => {
          props.setStartDate(props.startDate.plus({ weeks: 1 }));
        }}
      >
        <ChevronRightIcon w={6} h={6} />
      </Button>
    </div>
  );
};
