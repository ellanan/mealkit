/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Search2Icon } from '@chakra-ui/icons';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

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
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
          align-items: center;
          gap: 2rem;
          margin-top: 2rem;
          margin-right: 0;
        `}
      >
        {data?.recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((recipe) => (
            <div key={recipe.id}>
              {recipe.imageUrl ? (
                <img
                  src={`${recipe.imageUrl}`}
                  alt=''
                  css={css`
                    width: 10rem;
                    height: 10rem;
                    border-radius: 20px;
                  `}
                />
              ) : (
                <div
                  css={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 10rem;
                    height: 10rem;
                  `}
                >
                  no image
                </div>
              )}
              <h3>
                {recipe.name} - {recipe.category?.name}
              </h3>
              <NavLink
                to={`/recipes/${recipe.id}`}
                css={css`
                  padding: 0.4em;
                  color: #593e31;
                  border: 2px solid #ecb69d;
                  border-radius: 20px;
                  background-color: #fff;
                  :hover {
                    background-color: #f0b59a;
                  }
                `}
              >
                recipe details
              </NavLink>
            </div>
          ))}
      </div>
    </div>
  );
};
