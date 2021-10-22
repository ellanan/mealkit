/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Search2Icon } from '@chakra-ui/icons';
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
    <div>
      <div
        css={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <div
          css={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            border: 0.5px solid #ebb59c;
            border-radius: 20px;
            height: 2.4em;
            padding: 16px;
            width: 40%;
            margin-top: 3rem;
          `}
        >
          <label htmlFor='name'>
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
          </label>
          <input
            type='text'
            placeholder='search recipe'
            size={20}
            css={css`
              outline: none;
            `}
            onChange={(e) => {
              e.preventDefault();
              setSearch(e.target.value);
            }}
          />
        </div>
        <NavLink
          to='/recipes/create-recipe'
          css={css`
            padding: 0.5em 1.2em;
            color: #fff;
            font-weight: 700;
            border-radius: 20px;
            background-color: #fca579;
          `}
        >
          create recipe
        </NavLink>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr;
          align-items: center;
          justify-content: flex-start;
          margin-top: 2rem;
          margin-right: 0;
          width: 12rem;
        `}
      >
        {data?.recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((recipe) => (
            <div key={recipe.id}>
              <NavLink
                to={`/recipes/${recipe.id}`}
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 0.4em;
                  color: #593e31;
                  border-radius: 20px;

                  :hover {
                    background-color: #f8c9b3;
                  }
                `}
              >
                {recipe.imageUrl ? (
                  <img
                    src={`${recipe.imageUrl}`}
                    alt=''
                    css={css`
                      width: 4rem;
                      height: 3rem;
                      border-radius: 20px;
                      margin-right: 0.5rem;
                    `}
                  />
                ) : (
                  <img
                    src={defaultImg}
                    alt=''
                    css={css`
                      width: 4rem;
                      height: 3rem;
                      border-radius: 20px;
                      margin-right: 0.5rem;
                    `}
                  />
                )}
                {recipe.name}
              </NavLink>
            </div>
          ))}
      </div>
    </div>
  );
};
