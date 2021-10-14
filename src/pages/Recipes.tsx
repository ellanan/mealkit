/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, useMutation, gql } from '@apollo/client';
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

  const [
    removeIngredientFromRecipe,
    { error: errorRemovingIngredientFromRecipe },
  ] = useMutation<
    GraphQLTypes.RemoveIngredientFromRecipeMutation,
    GraphQLTypes.RemoveIngredientFromRecipeMutationVariables
  >(gql`
    mutation RemoveIngredientFromRecipe($recipeId: ID!, $ingredientId: ID!) {
      removeIngredientFromRecipe(
        recipeId: $recipeId
        ingredientId: $ingredientId
      ) {
        id
        name
      }
    }
  `);
  if (errorRemovingIngredientFromRecipe) {
    throw errorRemovingIngredientFromRecipe;
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
            <ul>
              <span>ingredients:</span>
              {recipe.ingredients?.map((ingredient) => (
                <div key={ingredient?.name}>
                  <li>{ingredient?.name}</li>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeIngredientFromRecipe({
                        variables: {
                          recipeId: recipe.id,
                          ingredientId: ingredient.id,
                        },
                      });
                    }}
                  >
                    remove ingredient
                  </button>
                </div>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
};
