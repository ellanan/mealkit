/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMutation, gql, useQuery } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import Creatable from 'react-select/creatable';
import { Editor } from '@tinymce/tinymce-react';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';

interface CreateRecipeForm {
  recipeName: string;
  imageUrl: string | null;
  ingredientQuantities: Array<{
    ingredient: { id: string; name: string };
    unit: string;
    amount: number;
  }>;
  content: string;
}

const initalFormDataState: CreateRecipeForm = {
  recipeName: '',
  imageUrl: null,
  ingredientQuantities: [],
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
      $ingredientQuantities: [IngredientQuantityInput!]!
    ) {
      createRecipe(
        name: $name
        imageUrl: $imageUrl
        content: $content
        ingredientQuantities: $ingredientQuantities
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
    <div
      css={css`
        margin: 1rem;
        color: #593e31;
      `}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createRecipe({
            variables: {
              name: formData.recipeName,
              imageUrl: formData.imageUrl,
              content: formData.content,
              ingredientQuantities: formData.ingredientQuantities.map(
                ({ ingredient, amount, unit }) => ({
                  amount,
                  unit,
                  ingredientId: ingredient.id,
                })
              ),
            },
          }).then((response) => {
            console.log('created recipe', response.data?.createRecipe?.id);
          });
          setFormData(initalFormDataState);
        }}
      >
        <ul>
          <li
            css={css`
              font-weight: 600;
              margin-bottom: 1rem;
            `}
          >
            <FormControl id='recipeName'>
              <FormLabel fontWeight={600}>Recipe Name</FormLabel>
              <Input
                type='text'
                width='50%'
                value={formData.recipeName}
                onChange={(e) => {
                  const recipeName = e.target.value;
                  setFormData((prev) => {
                    return { ...prev, recipeName };
                  });
                }}
              />
            </FormControl>
          </li>
          <li
            css={css`
              font-weight: 600;
              margin-bottom: 1rem;
            `}
          >
            <label>
              Image <br />
              <img
                src={formData.imageUrl ?? ''}
                alt=''
                css={css`
                  max-height: 300px;
                  max-width: 300px;
                  object-fit: cover;
                  margin-bottom: 0.6rem;
                  border-radius: 5px;
                `}
              />
              <input
                type='file'
                css={css`
                  font-size: 0.8rem;
                  color: transparent;
                `}
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
          <li
            css={css`
              font-weight: 600;
              margin-bottom: 1rem;
              position: relative;
            `}
          >
            <label>
              Content <br />
              <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                value={formData.content}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: ['wordcount'],
                  toolbar:
                    'undo redo | formatselect | ' +
                    'fontsizeselect bold italic underline forecolor backcolor | alignleft aligncenter | textcolor ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                }}
                onEditorChange={(newcontent) => {
                  setFormData((prev) => {
                    return { ...prev, content: newcontent };
                  });
                }}
              />
            </label>
          </li>
          <li
            css={css`
              margin-bottom: 1rem;
            `}
          >
            <label>
              <span
                css={css`
                  font-weight: 600;
                `}
              >
                Ingredients <br />
              </span>
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
                      ingredientQuantities: prev.ingredientQuantities.concat({
                        ingredient: newIngredient,
                        amount: 1,
                        unit: 'g',
                      }),
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
                    ingredientQuantities: prev.ingredientQuantities.concat({
                      ingredient: newIngredient,
                      amount: 1,
                      unit: 'g',
                    }),
                  }));
                }}
                isOptionDisabled={({ value }) =>
                  formData.ingredientQuantities.some(
                    ({ ingredient }) => ingredient.id === value
                  )
                }
                isSearchable
                placeholder='add ingredient'
              />
            </label>
            <ul>
              {formData.ingredientQuantities.map(
                ({ unit, amount, ingredient }) => {
                  return (
                    <div
                      key={ingredient.id}
                      css={css`
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        margin-left: 1rem;
                        margin-top: 0.5rem;
                      `}
                    >
                      <li
                        css={css`
                          min-width: 30rem;
                        `}
                      >
                        <input
                          type='number'
                          value={amount}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              ingredientQuantities:
                                prev.ingredientQuantities.map(
                                  (prevIngredientQuantity) => {
                                    if (
                                      prevIngredientQuantity.ingredient.id !==
                                      ingredient.id
                                    ) {
                                      return prevIngredientQuantity;
                                    }
                                    return {
                                      ...prevIngredientQuantity,
                                      amount: Number(e.target.value),
                                    };
                                  }
                                ),
                            }));
                          }}
                        />
                        <input
                          type='text'
                          value={unit}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              ingredientQuantities:
                                prev.ingredientQuantities.map(
                                  (prevIngredientQuantity) => {
                                    if (
                                      prevIngredientQuantity.ingredient.id !==
                                      ingredient.id
                                    ) {
                                      return prevIngredientQuantity;
                                    }
                                    return {
                                      ...prevIngredientQuantity,
                                      unit: e.target.value,
                                    };
                                  }
                                ),
                            }));
                          }}
                        />
                        {ingredient.name}
                      </li>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData((prev) => ({
                            ...prev,
                            ingredientQuantities:
                              prev.ingredientQuantities.filter(
                                ({ ingredient: { id } }) => ingredient.id !== id
                              ),
                          }));
                        }}
                        size={'xs'}
                      >
                        remove
                      </Button>
                    </div>
                  );
                }
              )}
            </ul>
          </li>
        </ul>
        <Button
          size={'sm'}
          type='submit'
          backgroundColor={'#f3ac83'}
          color={'#fff'}
        >
          Create Recipe
        </Button>
      </form>
    </div>
  );
};
