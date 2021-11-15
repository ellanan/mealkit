/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DateTime } from 'luxon';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { useMemo } from 'react';
import { BsInfoCircle as InfoIcon } from 'react-icons/bs';
import { Tooltip } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';

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
    <>
      <h1 className='text-sm text-25 font-medium mb-1 py-1 px-4'>
        <Tooltip
          label='Based on frequency from the last 30 days'
          className='bg-gray-400 bg-opacity-90 p-2 font-Raleway'
        >
          <span>
            Popular Recipes <InfoIcon className='inline-block w-3' />
          </span>
        </Tooltip>
      </h1>
      <div className='flex flex-col overflow-auto'>
        {data?.currentUser?.mealPlan?.popularRecipes.map((recipe) => (
          <NavLink
            className='flex items-center py-1 px-4 text-14 text-sm'
            key={recipe.id}
            to={(location) => {
              const newQueryParams = new URLSearchParams(location.search);
              newQueryParams.set('modalRecipeId', recipe.id);

              return {
                ...location,
                search: newQueryParams.toString(),
              };
            }}
            css={css`
              :hover {
                background-image: linear-gradient(
                  to right,
                  transparent,
                  #fae4daa3 20%,
                  #fae4da
                );
              }
            `}
          >
            <div className='w-12 h-12 rounded-full mr-2 relative overflow-hidden flex-shrink-0'>
              <img
                className='object-cover w-full h-full'
                src={recipe.imageUrl ?? defaultImg}
                alt=''
              />
              {recipe.id.startsWith('temp-id') && (
                <div className='flex items-center justify-center w-full h-full absolute top-0 bottom-0 backdrop-filter backdrop-blur-sm'>
                  <Spinner size='sm' color='#f88c5a' />
                </div>
              )}
            </div>
            {recipe.name}
          </NavLink>
        ))}
      </div>
    </>
  );
};
