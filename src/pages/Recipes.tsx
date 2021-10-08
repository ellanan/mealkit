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
      ingredientTypes {
        id
        name
      }
      ingredients {
        id
        name
        type {
          id
          name
        }
      }
      recipes {
        id
        name
        category {
          id
          name
        }
        ingredients {
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
          <div>
            <h3 key={recipe.id}>
              {recipe.name} - {recipe.category?.name}
            </h3>
            <ul>
              <span>ingredients:</span>
              {recipe.ingredients?.map((ingredient) => (
                <li key={ingredient?.name}>{ingredient?.name}</li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};
