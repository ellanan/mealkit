import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';

export const Recipes = () => {
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

  const [
    addIngredientToRecipe,
    {
      loading: isAddingIngredientToRecipe,
      error: errorAddingIngredientToRecipe,
    },
  ] = useMutation<
    GraphQLTypes.AddIngredientToRecipeMutation,
    GraphQLTypes.AddIngredientToRecipeMutationVariables
  >(gql`
    mutation AddIngredientToRecipe($ingredientId: ID!, $recipeId: ID!) {
      addIngredientToRecipe(ingredientId: $ingredientId, recipeId: $recipeId) {
        id
        ingredients {
          id
        }
      }
    }
  `);

  if (error) {
    throw error;
  }

  return (
    <>
      {data?.recipes?.map((recipe) => {
        if (!recipe) return null;
        return (
          <div key={recipe.id}>
            <h1>recipes page</h1>
            <h2>
              {recipe.name} - {recipe.category?.name}
            </h2>
            ingredients:
            <ul>
              {recipe.ingredients?.map((ingredient) => (
                <li>{ingredient?.name}</li>
              ))}
            </ul>
            <button
              onClick={() => {
                addIngredientToRecipe({
                  variables: {
                    ingredientId: '1',
                    recipeId: recipe.id,
                  },
                });
              }}
            >
              add salt
            </button>
          </div>
        );
      })}
    </>
  );
};
