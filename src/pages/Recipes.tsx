/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export const Recipes = () => {
  const [search, setSearch] = useState<string>('');

  const { data, error } = useQuery<GraphQLTypes.RecipesQuery>(gql`
    query Recipes {
      recipes {
        id
        name
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
      <NavLink
        to='/recipes/create-recipe'
        css={css`
          padding: 0.1em;
          border: 2px solid #000;
          border-radius: 10px;
          background-color: yellow;
        `}
      >
        create recipe
      </NavLink>
      <form>
        <label htmlFor='name'>search recipes</label>
        <input
          type='text'
          id='name'
          onChange={(e) => {
            e.preventDefault();
            setSearch(e.target.value);
          }}
        />
      </form>
      {data?.recipes
        .filter((recipe) =>
          recipe.name.toLowerCase().includes(search.toLowerCase())
        )
        .map((recipe) => (
          <div key={recipe.id}>
            <h3>
              {recipe.name} - {recipe.category?.name}
            </h3>
            <NavLink
              to={`/recipes/${recipe.id}`}
              css={css`
                padding: 0.1em;
                border: 2px solid #000;
                border-radius: 10px;
                background-color: yellow;
              `}
            >
              recipe details
            </NavLink>
          </div>
        ))}
    </div>
  );
};
