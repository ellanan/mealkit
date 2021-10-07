import { useMutation, gql, useQuery } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { useState } from 'react';

interface CreateRecipeForm {
  recipeName: string;
  ingredients: Array<{ id: string; name: string }>;
  content: string;
}

const initalFormDataState = {
  recipeName: '',
  ingredients: [],
  content: '',
};

export const CreateRecipe = () => {
  const [formData, setFormData] =
    useState<CreateRecipeForm>(initalFormDataState);

  const { data: ingredientsData, error: errorLoadingIngredients } =
    useQuery<GraphQLTypes.IngredientsQuery>(gql`
      query Ingredients {
        ingredients {
          id
          name
        }
      }
    `);
  if (errorLoadingIngredients) {
    throw errorLoadingIngredients;
  }

  const [createRecipe, { error: errorCreatingRecipe }] = useMutation<
    GraphQLTypes.CreateRecipeMutation,
    GraphQLTypes.CreateRecipeMutationVariables
  >(gql`
    mutation CreateRecipe(
      $name: String!
      $content: String!
      $ingredientIds: [ID!]!
    ) {
      createRecipe(
        name: $name
        content: $content
        ingredientIds: $ingredientIds
      ) {
        id
      }
    }
  `);
  if (errorCreatingRecipe) {
    throw errorCreatingRecipe;
  }

  // const [createIngredient, { error: errorCreatingIngredient }] = useMutation<
  //   GraphQLTypes.CreateIngredientMutation,
  //   GraphQLTypes.CreateIngredientMutationVariables
  // >(gql`
  //   mutation CreateIngredient($name: String!, $ingredientTypeId: ID!) {
  //     createIngredient(name: $name, ingredientTypeId: $ingredientTypeId) {
  //       id
  //       name
  //     }
  //   }
  // `);
  // if (errorCreatingIngredient) {
  //   throw errorCreatingIngredient;
  // }

  return (
    <>
      <h1>create recipe page</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createRecipe({
            variables: {
              name: formData.recipeName,
              content: formData.content,
              ingredientIds: formData.ingredients.map(({ id }) => id),
            },
          }).then((response) => {
            console.log('created recipe', response.data?.createRecipe?.id);
          });
          setFormData(initalFormDataState);
        }}
      >
        <ul>
          <li>
            <label>recipe name</label>
            <br />
            <input
              type='text'
              value={formData.recipeName}
              onChange={(e) => {
                const recipeName = e.target.value;
                setFormData((prev) => {
                  return { ...prev, recipeName };
                });
              }}
            />
          </li>
          <li>
            <label>content</label>
            <br />
            <textarea
              value={formData.content}
              name='content'
              rows={5}
              cols={100}
              onChange={(e) => {
                const content = e.target.value;
                setFormData((prev) => {
                  return { ...prev, content };
                });
              }}
            ></textarea>
          </li>
          <li>
            <label>ingredients</label>
            <br />
            <select
              onChange={(e) => {
                const ingredient = ingredientsData?.ingredients?.find(
                  ({ id }) => id === e.target.value
                );
                if (ingredient) {
                  setFormData((prev) => ({
                    ...prev,
                    ingredients: prev.ingredients.concat(ingredient),
                  }));
                }
              }}
            >
              {ingredientsData?.ingredients?.map((ingredient) => {
                return (
                  <option
                    key={ingredient?.id}
                    value={ingredient.id}
                    disabled={formData.ingredients.some(
                      (ingredientWeAlreadyHave) =>
                        ingredientWeAlreadyHave.id === ingredient.id
                    )}
                  >
                    {ingredient?.name}
                  </option>
                );
              })}
            </select>
            <ul>
              {formData.ingredients.map((ingredient) => {
                return <li key={ingredient.id}>{ingredient.name}</li>;
              })}
            </ul>
          </li>
        </ul>
        <button type='submit'>create recipe</button>
      </form>
    </>
  );
};
