/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { NavLink } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';
import { useState } from 'react';
import { Search2Icon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { Button } from '@chakra-ui/react';

const defaultImg = require('../../images/defaultImg.jpg').default;

const pageSize = 12;

export const MobileRecipesInRecipesPage = () => {
  const [search, setSearch] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);

  const {
    data,
    error,
    loading: loadingRecipes,
    fetchMore,
  } = useQuery<
    GraphQLTypes.RecipesInRecipesPageQuery,
    GraphQLTypes.RecipesInRecipesPageQueryVariables
  >(
    gql`
      query RecipesInRecipesPage(
        $cursor: ID
        $limit: Int!
        $order: Order!
        $orderBy: RecipeOrderBy!
        $search: String
      ) {
        currentUser {
          id
          mealPlan {
            id
            recipes(
              cursor: $cursor
              limit: $limit
              order: $order
              orderBy: $orderBy
              search: $search
            ) {
              id
              name
              imageUrl
              createdAt
              updatedAt
            }
          }
        }
      }
    `,
    {
      variables: {
        limit: pageSize,
        order: GraphQLTypes.Order.Desc,
        orderBy: GraphQLTypes.RecipeOrderBy.UpdatedAt,
        search: search || undefined,
      },
    }
  );
  if (error) {
    throw error;
  }

  return (
    <div
      className='flex flex-col overflow-auto text-14 h-full'
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
      <div className='flex items-center justify-center'>
        <InputGroup borderColor='#ebb59c' mx='6' my='6' w='inherit'>
          <InputLeftElement
            pointerEvents='none'
            ml='1'
            children={
              <Search2Icon className='flex items-center justify-center h-4 w-4 mr-2 left-0 text-17' />
            }
          />
          <Input
            type='tel'
            placeholder='Search for recipe'
            borderRadius='20px'
            focusBorderColor='orange.300'
            autoFocus={true}
            inputMode='search'
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
          />
        </InputGroup>
      </div>

      {loadingRecipes ? (
        <div className='flex items-center justify-center w-full h-full absolute'>
          <Spinner size='xl' color='#f88c5a' />
        </div>
      ) : null}

      <div className='flex-grow grid xs:grid-cols-2 grid-cols-2 gap-2 mb-8 mx-8'>
        {data?.currentUser?.mealPlan?.recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((recipe) => (
            <NavLink
              className='flex flex-col py-1 px-1 text-sm hover:opacity-70'
              key={recipe.id}
              to={(location) => {
                const newQueryParams = new URLSearchParams(location.search);
                newQueryParams.append('modalRecipeId', recipe.id);

                return {
                  ...location,
                  search: newQueryParams.toString(),
                };
              }}
            >
              <div className='h-36 w-36 relative overflow-hidden flex-shrink-0'>
                <img
                  className='object-cover w-full h-full rounded-2xl'
                  src={recipe.imageUrl ?? defaultImg}
                  alt=''
                />
                {recipe.id.startsWith('temp-id') && (
                  <div className='flex items-center justify-center w-full h-full absolute'>
                    <Spinner size='sm' color='#f88c5a' />
                  </div>
                )}
              </div>
              <span className='text-14 text-md font-medium text-center uppercase'>
                {recipe.name}
              </span>
            </NavLink>
          ))}
      </div>
      <div className='flex items-center justify-center mb-10'>
        <Button
          className='object-contain rounded-full text-white text-base font-medium py-1 px-3 bg-22 hover:bg-25 disabled:hover:bg-11'
          disabled={
            !hasMore ||
            loadingRecipes ||
            (data?.currentUser?.mealPlan?.recipes?.length ?? 0) < pageSize
          }
          onClick={() =>
            fetchMore({
              variables: {
                cursor: data?.currentUser?.mealPlan?.recipes.slice(-1)[0].id,
              },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                if (
                  (fetchMoreResult.currentUser?.mealPlan?.recipes?.length ??
                    0) < pageSize
                ) {
                  setHasMore(false);
                }
                return Object.assign({}, prev, {
                  ...prev,
                  currentUser: {
                    ...prev.currentUser,
                    mealPlan: {
                      ...prev.currentUser?.mealPlan,
                      recipes: [
                        ...(prev.currentUser?.mealPlan?.recipes ?? []),
                        ...(fetchMoreResult.currentUser?.mealPlan?.recipes ??
                          []),
                      ],
                    },
                  },
                });
              },
            })
          }
        >
          {!hasMore ? (
            <span>No more recipes to load</span>
          ) : (
            <span>Load more</span>
          )}
        </Button>
      </div>
    </div>
  );
};
