/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { SearchForm } from '../components/SearchForm';

export const Recipes = () => {
  const [showRecipeDetails, setShowRecipeDetails] = useState(false);

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
    <>
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
      <SearchForm />
      {data?.recipes?.map((recipe) => {
        if (!recipe) return null;
        return (
          <div key={recipe.id}>
            <h2>
              {recipe.name} - {recipe.category?.name}
            </h2>
            {showRecipeDetails ? (
              <ul>
                <span>ingredients:</span>
                {recipe.ingredients?.map((ingredient) => (
                  <li key={ingredient?.name}>{ingredient?.name}</li>
                ))}
              </ul>
            ) : null}
            <button
              onClick={() => {
                setShowRecipeDetails(true);
              }}
            >
              show details
            </button>
          </div>
        );
      })}
    </>
  );
};
