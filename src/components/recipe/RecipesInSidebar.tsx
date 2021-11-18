/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { Search2Icon, SmallAddIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';

import { PopularRecipes } from './PopularRecipes';
import { RecentRecipes } from './RecentRecipes';

const defaultImg = require('../../images/defaultImg.jpg').default;

export const RecipesInSideBar = () => {
  const [search, setSearch] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const { data, error } = useQuery<GraphQLTypes.RecipesInSideBarQuery>(gql`
    query RecipesInSideBar {
      recipes {
        ...RecipeInList
      }
    }
    ${GraphQLTypes.RecipeInListFragmentDoc}
  `);
  if (error) {
    throw error;
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center mt-8'>
        <InputGroup borderColor='#ebb59c' mx='2' w='auto'>
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
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
              e.target.value !== ''
                ? setIsSearching(true)
                : setIsSearching(false);
            }}
          />
        </InputGroup>
        <NavLink
          className='flex items-center justify-center text-25 font-medium text-sm mt-3 mb-3'
          to={(location) => {
            const newQueryParams = new URLSearchParams(location.search);
            newQueryParams.append('modalCreateRecipe', 'visible');

            return {
              ...location,
              search: newQueryParams.toString(),
            };
          }}
        >
          <SmallAddIcon w={4} h={4} /> Create Recipe
        </NavLink>
      </div>

      {!isSearching ? (
        <>
          <PopularRecipes />
          <RecentRecipes />
        </>
      ) : (
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
          {data?.recipes
            .filter((recipe) =>
              recipe.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((recipe) => (
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
      )}
    </>
  );
};
