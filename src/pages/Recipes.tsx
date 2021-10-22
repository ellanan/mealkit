/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Search2Icon } from '@chakra-ui/icons';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Input, InputGroup, InputLeftElement } from '@chakra-ui/input';

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
        `}
      >
        <NavLink
          to='/recipes/create-recipe'
          css={css`
            padding: 0.5em 1.2em;
            margin-top: 2rem;
            color: #fff;
            font-weight: 700;
            border-radius: 20px;
            background-color: #fca579;
          `}
        >
          create recipe
        </NavLink>
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
            ml='2'
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
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
          />
        </InputGroup>
      </div>
      <div
        css={css`
          margin-top: 1rem;
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
                  /* width: 4rem;
                  height: 3rem; */
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
