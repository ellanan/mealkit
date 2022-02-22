/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { Spinner } from '@chakra-ui/spinner';

const defaultImg = require('../../images/defaultImg.jpg').default;

export const RecentRecipes = () => {
  const { data, error: errorLoadingRecipes } = useQuery<
    GraphQLTypes.SortedRecipesQuery,
    GraphQLTypes.SortedRecipesQueryVariables
  >(
    gql`
      query SortedRecipes(
        $orderBy: RecipeOrderBy!
        $order: Order!
        $limit: Int!
      ) {
        currentUser {
          id
          mealPlan {
            id
            recipes(orderBy: $orderBy, order: $order, limit: $limit) {
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
        orderBy: GraphQLTypes.RecipeOrderBy.CreatedAt,
        order: GraphQLTypes.Order.Desc,
        limit: 3,
      },
    }
  );
  if (errorLoadingRecipes) {
    throw errorLoadingRecipes;
  }

  return (
    <>
      <h1 className='text-xs text-25 font-medium mb-1 py-1 px-4 mt-3 uppercase opacity-70'>
        <span>Recently Added</span>
      </h1>
      <div
        className='flex flex-col overflow-auto'
        css={css`
          scrollbar-width: thin;
          scrollbar-color: #e7a47a60 transparent;
          ::-webkit-scrollbar {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            border-bottom: 4px solid #fff2ec;
            border-left: 4px solid #fff2ec;
            border-right: 4px solid #fff2ec;
            border-top: 4px solid #fff2ec;
            border-radius: 8px;
            background: #e7a47a60;
            min-height: 40 px;
          }
        `}
      >
        {data?.currentUser?.mealPlan?.recipes.map((recipe) => (
          <NavLink
            className='flex items-center py-1 px-4 text-14 text-sm font-medium'
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
                  #fff1ea 20%,
                  #fed7c5
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
