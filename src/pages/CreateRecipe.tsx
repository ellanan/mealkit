import { useMutation, gql, useQuery } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import Creatable from 'react-select/creatable';
import { useState } from 'react';

interface CreateRecipeForm {
  recipeName: string;
  imageUrl: string | null;
  ingredients: Array<{ id: string; name: string }>;
  content: string;
}

const initalFormDataState = {
  recipeName: '',
  imageUrl: null,
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
      $imageUrl: String
      $content: String!
      $ingredientIds: [ID!]!
    ) {
      createRecipe(
        name: $name
        imageUrl: $imageUrl
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

  const [createIngredient, { error: errorCreatingIngredient }] = useMutation<
    GraphQLTypes.CreateIngredientMutation,
    GraphQLTypes.CreateIngredientMutationVariables
  >(gql`
    mutation CreateIngredient($name: String!) {
      createIngredient(name: $name) {
        id
        name
      }
    }
  `);
  if (errorCreatingIngredient) {
    throw errorCreatingIngredient;
  }

  return (
    <>
      <h1>create recipe page</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createRecipe({
            variables: {
              name: formData.recipeName,
              imageUrl: formData.imageUrl,
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
            <label>
              recipe name <br />
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
            </label>
          </li>
          <li>
            <label>
              image <br />
              <input
                type='file'
                onChange={async (e) => {
                  const fileToUpload = e.target.files?.[0];
                  if (!fileToUpload) return;

                  const formdata = new FormData();
                  formdata.append('image', fileToUpload, fileToUpload.name);

                  const response = await fetch(
                    'https://api.imgur.com/3/image',
                    {
                      method: 'POST',
                      headers: {
                        Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`,
                      },
                      body: formdata,
                      redirect: 'follow',
                    }
                  ).then((response) => response.json());
                  console.log(response);

                  setFormData((prev) => ({
                    ...prev,
                    imageUrl: response.data.link,
                  }));
                }}
              />
            </label>
          </li>
          <li>
            <label>
              content <br />
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
              />
            </label>
          </li>
          <li>
            <label>
              ingredients <br />
              <Creatable
                options={ingredientsData?.ingredients?.map((ingredient) => {
                  return { value: ingredient.id, label: ingredient.name };
                })}
                onChange={async (newValue, actionMeta) => {
                  if (!newValue || !newValue.value) {
                    console.log(`no newValue`, actionMeta);
                    return;
                  }

                  if (actionMeta.action === 'create-option') {
                    const createIngredientResponse = await createIngredient({
                      variables: {
                        name: newValue.value,
                      },
                    });
                    if (!createIngredientResponse.data?.createIngredient) {
                      console.log(
                        `failed to create ingredient`,
                        createIngredientResponse
                      );
                      return;
                    }
                    const newIngredient =
                      createIngredientResponse.data.createIngredient;
                    setFormData((prev) => ({
                      ...prev,
                      ingredients: prev.ingredients.concat(newIngredient),
                    }));
                    return;
                  }

                  const newIngredientId = newValue.value;
                  const newIngredient = ingredientsData?.ingredients?.find(
                    ({ id }) => id === newIngredientId
                  );
                  if (!newIngredient) {
                    console.log(`ingredient ${newValue.label} not found`);
                    return;
                  }
                  setFormData((prev) => ({
                    ...prev,
                    ingredients: prev.ingredients.concat(newIngredient),
                  }));
                }}
                isOptionDisabled={({ value }) =>
                  formData.ingredients.some(
                    (ingredientWeAlreadyHave) =>
                      ingredientWeAlreadyHave.id === value
                  )
                }
                isSearchable
                placeholder='add ingredient'
              />
            </label>
            <ul>
              {formData.ingredients.map((ingredient) => {
                return (
                  <div style={{ display: 'flex' }} key={ingredient.id}>
                    <li>{ingredient.name}</li>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setFormData((prev) => ({
                          ...prev,
                          ingredients: prev.ingredients.filter((ing) => {
                            return ingredient.id !== ing.id;
                          }),
                        }));
                      }}
                    >
                      remove ingredient
                    </button>
                  </div>
                );
              })}
            </ul>
          </li>
        </ul>
        <button type='submit'>create recipe</button>
      </form>
    </>
  );
};
