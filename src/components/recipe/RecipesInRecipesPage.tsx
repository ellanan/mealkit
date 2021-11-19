/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { NavLink } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';

import { TopNavBar } from '../nav/TopNavBar';

const defaultImg = require('../../images/defaultImg.jpg').default;

export const RecipesInRecipesPage = () => {
  const { data, error } = useQuery<GraphQLTypes.RecipesInRecipesPageQuery>(gql`
    query RecipesInRecipesPage {
      recipes {
        id
        name
        imageUrl
      }
    }
  `);
  if (error) {
    throw error;
  }

  return (
    <div
      className='flex flex-col overflow-auto text-14 h-full pt-12'
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
      <div className='flex items-center fixed z-10 right-0 top-0'>
        <TopNavBar />
      </div>

      <div className='flex-grow grid md:grid-cols-4 sm:grid-cols-3 gap-2 mb-8 mx-2'>
        {data?.recipes.map((recipe) => (
          <NavLink
            className='flex flex-col py-1 px-4 text-sm hover:opacity-70'
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
            <div className='lg:h-48 md:h-32 relative overflow-hidden flex-shrink-0'>
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
            <span className='text-14 text-xl text-center font-medium min-h-[2em] leading-none mt-2'>
              {recipe.name}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
