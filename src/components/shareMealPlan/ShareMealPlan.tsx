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
    <div className='flex flex-col items-center justify-center'>
      <p className='text-sm text-green-400 mt-2 mb-2 min-h-[20px]'>
        {copySuccessMessage}
      </p>
      <button
        className='flex items-center justify-center text-white text-xs px-3 py-2 mb-8 border-1 rounded-3xl font-semibold bg-17 hover:bg-23'
        onClick={() => {
          navigator.clipboard.writeText(mealPlanUrl);
          setCopySuccessMessage('Copied to clipboard!');
        }}
      >
        <BiShareAlt size={14} className='mr-2' />
        Share my meal plan
      </button>
    </div>
  );
};
