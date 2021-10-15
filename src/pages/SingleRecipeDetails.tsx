/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useMutation, gql, useQuery } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import Creatable from 'react-select/creatable';
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Spinner,
} from '@chakra-ui/react';
import { Editor } from '@tinymce/tinymce-react';
import { useState } from 'react';

export const SingleRecipeDetails = ({ recipeId }: { recipeId: string }) => {
  const [isEditingRecipeContent, setIsEditingRecipeContent] =
    useState<boolean>(false);
  const [recipeContent, setRecipeContent] = useState<string>('');
  const {
    data: recipeDetails,
    loading: loadingRecipeDetails,
    error: errorLoandingRecipeDetails,
  } = useQuery<
    GraphQLTypes.SingleRecipeQuery,
    GraphQLTypes.SingleRecipeQueryVariables
  >(
    gql`
      query SingleRecipe($recipeId: ID!) {
        recipe(recipeId: $recipeId) {
          id
          name
          imageUrl
          content
          category {
            id
            name
          }
          ingredientQuantities {
            unit
            amount
            ingredient {
              id
              name
            }
          }
        }
      }
    `,
    {
      variables: {
        recipeId,
      },
    }
  );
  if (errorLoandingRecipeDetails) {
    throw errorLoandingRecipeDetails;
  }

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

  const [editRecipe, { error: errorEditingRecipe }] = useMutation<
    GraphQLTypes.EditRecipeMutation,
    GraphQLTypes.EditRecipeMutationVariables
  >(
    gql`
      mutation EditRecipe(
        $recipeId: String!
        $name: String
        $imageUrl: String
        $content: String
      ) {
        editRecipe(
          recipeId: $recipeId
          name: $name
          imageUrl: $imageUrl
          content: $content
        ) {
          id
          name
          imageUrl
          content
        }
      }
    `
  );
  if (errorEditingRecipe) {
    throw errorEditingRecipe;
  }

  const [
    addIngredientQuantityToRecipe,
    { error: errorAddingIngredientQuantity },
  ] = useMutation<
    GraphQLTypes.AddIngredientQuantityToRecipeMutation,
    GraphQLTypes.AddIngredientQuantityToRecipeMutationVariables
  >(gql`
    mutation AddIngredientQuantityToRecipe(
      $recipeId: ID!
      $ingredientQuantity: IngredientQuantityInput!
    ) {
      addIngredientQuantityToRecipe(
        recipeId: $recipeId
        ingredientQuantity: $ingredientQuantity
      ) {
        id
        ingredientQuantities {
          ingredient {
            id
            name
          }
          amount
          unit
        }
      }
    }
  `);
  if (errorAddingIngredientQuantity) {
    throw errorAddingIngredientQuantity;
  }

  const [removeIngredientFromRecipe, { error: errorRemovingIngredient }] =
    useMutation<
      GraphQLTypes.RemoveIngredientFromRecipeMutation,
      GraphQLTypes.RemoveIngredientFromRecipeMutationVariables
    >(gql`
      mutation RemoveIngredientFromRecipe($recipeId: ID!, $ingredientId: ID!) {
        removeIngredientFromRecipe(
          recipeId: $recipeId
          ingredientId: $ingredientId
        ) {
          id
          ingredientQuantities {
            ingredient {
              id
            }
          }
        }
      }
    `);
  if (errorRemovingIngredient) {
    throw errorRemovingIngredient;
  }

  const [
    updateIngredientQuantityInRecipe,
    { error: errorUpdatingIngredientQuantity },
  ] = useMutation<
    GraphQLTypes.UpdateIngredientQuantityInRecipeMutation,
    GraphQLTypes.UpdateIngredientQuantityInRecipeMutationVariables
  >(gql`
    mutation UpdateIngredientQuantityInRecipe(
      $recipeId: ID!
      $ingredientId: ID!
      $amount: Int
      $unit: String
    ) {
      updateIngredientQuantityInRecipe(
        recipeId: $recipeId
        ingredientId: $ingredientId
        amount: $amount
        unit: $unit
      ) {
        id
        ingredientQuantities {
          amount
          unit
          ingredient {
            id
          }
          recipe {
            id
          }
        }
      }
    }
  `);
  if (errorUpdatingIngredientQuantity) {
    throw errorUpdatingIngredientQuantity;
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

  if (loadingRecipeDetails) {
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
        `}
      >
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.500'
          size='xl'
        />
      </div>
    );
  }

  return (
    <>
      <h1>recipe details</h1>

      <ul>
        <li>
          <label>
            {recipeDetails?.recipe?.name && (
              <Editable
                defaultValue={recipeDetails?.recipe?.name}
                onSubmit={(newName) => {
                  editRecipe({
                    variables: {
                      recipeId,
                      name: newName,
                    },
                  });
                }}
              >
                <EditablePreview />
                <EditableInput />
              </Editable>
            )}
          </label>
        </li>
        <li>
          <label>
            {recipeDetails?.recipe?.imageUrl && (
              <img
                src={recipeDetails.recipe.imageUrl}
                alt=''
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            )}
            <input
              type='file'
              onChange={async (e) => {
                const fileToUpload = e.target.files?.[0];
                if (!fileToUpload) return;

                const formdata = new FormData();
                formdata.append('image', fileToUpload, fileToUpload.name);

                const response = await fetch('https://api.imgur.com/3/image', {
                  method: 'POST',
                  headers: {
                    Authorization: `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`,
                  },
                  body: formdata,
                  redirect: 'follow',
                }).then((response) => response.json());

                editRecipe({
                  variables: {
                    recipeId,
                    imageUrl: response.data.link,
                  },
                });
              }}
            />
          </label>
        </li>
        <li>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await editRecipe({
                variables: {
                  recipeId,
                  content: recipeContent,
                },
              });
              setIsEditingRecipeContent(false);
            }}
          >
            <label
              tabIndex={0}
              css={css`
                position: relative;
              `}
              onClick={() => {
                if (!isEditingRecipeContent) {
                  setIsEditingRecipeContent(true);
                }
              }}
            >
              content <br />
              {!isEditingRecipeContent && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: recipeDetails?.recipe?.content ?? '',
                  }}
                />
              )}
              {recipeDetails?.recipe?.content !== undefined &&
                recipeDetails?.recipe?.content !== null &&
                isEditingRecipeContent && (
                  <div>
                    <Editor
                      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                      initialValue={recipeDetails.recipe.content}
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
                        setRecipeContent(newcontent);
                      }}
                    />
                    <Button
                      onClick={() => {
                        setIsEditingRecipeContent(false);
                        setRecipeContent(recipeDetails?.recipe?.content ?? '');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type='submit'>Save</Button>
                  </div>
                )}
            </label>
          </form>
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

                let newIngredientId = newValue.value;

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
                  newIngredientId =
                    createIngredientResponse.data.createIngredient.id;
                }

                addIngredientQuantityToRecipe({
                  variables: {
                    ingredientQuantity: {
                      amount: 0,
                      unit: 'unspecified',
                      ingredientId: newIngredientId,
                    },
                    recipeId,
                  },
                });
              }}
              isOptionDisabled={({ value }) =>
                !!recipeDetails?.recipe?.ingredientQuantities?.some(
                  ({ ingredient }) => ingredient.id === value
                )
              }
              isSearchable
              placeholder='add ingredient'
            />
          </label>
          <ul>
            {recipeDetails?.recipe?.ingredientQuantities?.map(
              ({ unit, amount, ingredient }) => {
                return (
                  <div style={{ display: 'flex' }} key={ingredient.id}>
                    <li
                      css={css`
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding-right: 10px;
                      `}
                    >
                      <Editable
                        defaultValue={`${amount}`}
                        onSubmit={(newValue) => {
                          updateIngredientQuantityInRecipe({
                            variables: {
                              recipeId,
                              ingredientId: ingredient.id,
                              amount: Number(newValue),
                            },
                          });
                        }}
                        css={css`
                          padding-right: 10px;
                        `}
                      >
                        <EditablePreview />
                        <EditableInput type='number' />
                      </Editable>

                      <Editable
                        defaultValue={unit}
                        onSubmit={(newValue) => {
                          updateIngredientQuantityInRecipe({
                            variables: {
                              recipeId,
                              ingredientId: ingredient.id,
                              unit: newValue,
                            },
                          });
                        }}
                        css={css`
                          padding-right: 10px;
                        `}
                      >
                        <EditablePreview />
                        <EditableInput type='text' />
                      </Editable>
                      {ingredient.name}
                    </li>
                    <Button
                      type='button'
                      onClick={() => {
                        removeIngredientFromRecipe({
                          variables: {
                            ingredientId: ingredient.id,
                            recipeId,
                          },
                        });
                      }}
                    >
                      remove ingredient
                    </Button>
                  </div>
                );
              }
            )}
          </ul>
        </li>
      </ul>
    </>
  );
};
