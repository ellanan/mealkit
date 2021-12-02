import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { BiShareAlt } from 'react-icons/bi';
import { useState, useEffect } from 'react';

export const ShareMealPlan = () => {
  const [copySuccessMessage, setCopySuccessMessage] = useState('');

  const { data, error: errorLoadingUserMealPlan } =
    useQuery<GraphQLTypes.CurrentUserMealPlanQuery>(gql`
      query CurrentUserMealPlan {
        currentUser {
          id
          mealPlan {
            id
          }
        }
      }
    `);
  if (errorLoadingUserMealPlan) {
    throw errorLoadingUserMealPlan;
  }

  const mealPlanUrl = `${window.location.origin}/invite?mealPlanId=${data?.currentUser?.mealPlan?.id}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopySuccessMessage('');
    }, 1000);
    return () => clearTimeout(timer);
  }, [copySuccessMessage]);

  return (
    <div className='flex flex-col'>
      <p className='text-sm text-green-400 min-h-[20px] ml-11'>
        {copySuccessMessage}
      </p>
      <button
        className='font-Raleway flex items-center text-14 text-sm pl-4 py-2 hover:bg-12'
        onClick={() => {
          navigator.clipboard.writeText(mealPlanUrl);
          setCopySuccessMessage('Copied to clipboard!');
        }}
      >
        <BiShareAlt size={14} className='min-w-[20px] mr-2' />
        Share Meal Plan
      </button>
    </div>
  );
};
