import { DateTime } from 'luxon';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { useMemo } from 'react';
import { BsInfoCircle as InfoIcon } from 'react-icons/bs';
import { Tooltip } from '@chakra-ui/react';

const defaultImg = require('../mealPlan/images/defaultImg.jpg').default;

export const PopularRecipes = () => {
  const today = useMemo(() => DateTime.now(), []);
  const startDate = useMemo(() => today.minus({ days: 30 }), [today]);

  const { data, error: errorLoadingMonthlyPlannedMeals } = useQuery<
    GraphQLTypes.MonthlyPlannedMealsQuery,
    GraphQLTypes.MonthlyPlannedMealsQueryVariables
  >(
    gql`
      query MonthlyPlannedMeals($startDate: String!, $endDate: String!) {
        currentUser {
          id
          mealPlan {
            id
            popularRecipes(startDate: $startDate, endDate: $endDate, limit: 3) {
              id
              name
              imageUrl
            }
          }
        }
      }
    `,
    {
      variables: {
        startDate: startDate.toISO(),
        endDate: today.toISO(),
      },
    }
  );
  if (errorLoadingMonthlyPlannedMeals) {
    throw errorLoadingMonthlyPlannedMeals;
  }

  return (
    <div className='py-1 px-4 text-14'>
      <h1 className='text-sm text-25 font-medium mb-1'>
        <Tooltip
          label='Based on frequency from the last 30 days'
          className='bg-gray-400 bg-opacity-90 p-2 font-Raleway'
        >
          <span>
            Popular Recipes <InfoIcon className='inline-block w-3' />
          </span>
        </Tooltip>
      </h1>
      <span className='text-sm'>
        <ol>
          {data?.currentUser?.mealPlan?.popularRecipes.map((recipe) => (
            <li
              className='flex flex-row items-center justify-start relative overflow-hidden'
              key={recipe.id}
            >
              <img
                className='object-cover w-12 h-12 rounded-full mb-1 mr-2'
                src={recipe.imageUrl || defaultImg}
                alt=''
              />
              {recipe.name}
            </li>
          ))}
        </ol>
      </span>
    </div>
  );
};
