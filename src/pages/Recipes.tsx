/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Search2Icon, SmallAddIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const defaultImg = require('../images/defaultImg.jpg').default;

export const Recipes = () => {
  const [search, setSearch] = useState<string>('');

  const { data, error } = useQuery<GraphQLTypes.RecipesQuery>(gql`
    query Recipes {
      recipes {
        id
        name
        imageUrl
        category {
          id
          name
        }
      }
    }
  `);
  if (error) {
    throw error;
  }

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
        `}
      >
        <InputGroup
          borderColor='#ebb59c'
          mx='2'
          w='auto'
          css={css`
            & ::placeholder {
              color: #555;
            }
          `}
        >
          <InputLeftElement
            pointerEvents='none'
            ml='1'
            children={
              <Search2Icon
                css={css`
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  height: 15px;
                  width: 15px;
                  margin-right: 0.5em;
                  left: 0;
                  color: #ebb59c;
                `}
              />
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
            }}
          />
        </InputGroup>
        <NavLink
          to='/recipes/create-recipe'
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fa7532;
            font-size: 0.9rem;
            font-weight: 500;
            margin-top: 0.6rem;
            margin-bottom: 0.6rem;
          `}
        >
          <SmallAddIcon w={4} h={4} /> Create Recipe
        </NavLink>
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          overflow: auto;

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
              to={`/recipes/${recipe.id}`}
              css={css`
                display: flex;
                align-items: center;
                padding: 0.4em 1em;
                color: #593e31;
                font-size: 14px;
                line-height: 1.2;

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
              <img
                src={recipe.imageUrl ?? defaultImg}
                alt=''
                css={css`
                  width: 3rem;
                  height: 3rem;
                  border-radius: 100px;
                  margin-right: 0.5rem;
                  object-fit: cover;
                `}
              />
              {recipe.name}
            </NavLink>
          ))}
      </div>
    </>
  );
};
