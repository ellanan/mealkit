/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { Spinner } from '@chakra-ui/spinner';
import { Search2Icon } from '@chakra-ui/icons';
import { Button, useMediaQuery } from '@chakra-ui/react';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';

import defaultImg from '../../images/defaultImg.jpg';

const pageSize = 12;

export const RecipesInRecipesPage = () => {
  const [search, setSearch] = useState<string>('');
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [isLargerThan850] = useMediaQuery('(min-width: 850px)');

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
      className={
        isLargerThan850
          ? 'flex flex-col overflow-auto text-14 h-full'
          : 'flex flex-col text-14 h-full pt-12'
      }
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
        <InputGroup borderColor='#ebb59c' mx='6' my='10' w='inherit'>
          <InputLeftElement
            pointerEvents='none'
            ml='1'
            children={
              <Search2Icon className='flex items-center justify-center h-4 w-4 mr-2 left-0 text-17' />
            }
          />
          <Input
            type=''
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

      <div
        className={
          isLargerThan850
            ? 'flex-grow grid md:grid-cols-4 sm:grid-cols-3 gap-2 mb-8 mx-8'
            : 'flex-grow flex flex-row flex-wrap justify-evenly'
        }
      >
        {data?.currentUser?.mealPlan?.recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((recipe) => (
            <NavLink
              className={
                isLargerThan850
                  ? 'flex flex-col py-1 px-4 text-sm hover:opacity-70'
                  : 'flex flex-col items-center justify-center text-sm hover:opacity-70 mb-6'
              }
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
              <div
                className={
                  isLargerThan850
                    ? 'lg:h-48 relative overflow-hidden flex-shrink-0'
                    : 'h-36 w-36 relative overflow-hidden flex-shrink-0'
                }
              >
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
              <span
                className={
                  isLargerThan850
                    ? 'text-14 text-lg text-center uppercase font-medium min-h-[2em] leading-none mt-2'
                    : 'text-14 text-md font-medium text-center uppercase'
                }
              >
                {recipe.name}
              </span>
            </NavLink>
          ))}
      </div>

      <div className='flex items-center justify-center mb-10'>
        <Button
          className={
            isLargerThan850
              ? 'object-contain rounded-full text-white text-base font-medium py-1 px-3 mb-6 bg-22 hover:bg-25 disabled:hover:bg-11'
              : 'object-contain rounded-full text-white text-base font-medium py-1 px-3 mb-20 bg-22 w-32'
          }
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
                // The Object.assign() method copies all enumerable own properties from one or
                // more source objects to a target object. It returns the modified target object.
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
