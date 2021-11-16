import { useAuth0 } from '@auth0/auth0-react';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { BiListUl } from 'react-icons/bi';
import { VscAccount } from 'react-icons/vsc';
import { NavLink } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Login } from '../login/Login';

export const MealPlanTopBar = (props: {
  today: DateTime;
  interval: DateTime[];
  startDate: DateTime;
  setStartDate: (date: DateTime) => void;
}) => {
  const { user } = useAuth0();

  return (
    <div className='flex items-center justify-start pt-3'>
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
      <Popover closeOnBlur={true} closeOnEsc={true}>
        <PopoverTrigger>
          <button className='mr-4'>
            {user?.image !== null || undefined ? (
              <img
                className='w-7 h-7 rounded-full'
                src={user?.picture}
                alt=''
              />
            ) : (
              <VscAccount className='text-23' size={22} />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className='focus:shadow-none'
          maxWidth='280'
          minWidth='240'
          shadow='lg'
          borderRadius='10px'
        >
          <div className='flex flex-col items-center justify-center my-3 text-14'>
            {user?.image !== null || undefined ? (
              <img
                className='w-14 h-14 rounded-full'
                src={user?.picture}
                alt=''
              />
            ) : (
              <VscAccount className='text-23' size={22} />
            )}
            <span className='mt-2 text-lg font-medium'>
              {user?.name?.includes('@')
                ? user?.email?.substring(0, user.email.lastIndexOf('@'))
                : user?.name}
            </span>
            <span className='mt-1 text-sm'>{user?.email}</span>
            <Login />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
