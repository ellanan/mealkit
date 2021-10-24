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
import { SmallCloseIcon, EditIcon } from '@chakra-ui/icons';
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
    <ul
      css={css`
        margin: 1rem;
        color: #593e31;
      `}
    >
      <li
        css={css`
          margin-bottom: 1rem;
        `}
      >
        <label>
          {recipeDetails?.recipe?.name && (
            <Editable
              defaultValue={recipeDetails?.recipe?.name}
              fontSize={'1.6rem'}
              fontWeight={'500'}
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
        {recipeDetails?.recipe?.imageUrl && (
          <img
            src={recipeDetails.recipe.imageUrl}
            alt=''
            css={css`
              max-height: 300px;
              max-width: 300px;
              object-fit: cover;
              margin-bottom: 0.6rem;
              border-radius: 5px;
            `}
          />
        )}
        <input
          type='file'
          name='test'
          css={css`
            margin-bottom: 1rem;
            font-size: 0.8rem;
            color: transparent;
          `}
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
      </li>
      <li
        css={css`
          margin-bottom: 1rem;
        `}
      >
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
            <span
              css={css`
                font-weight: 600;
              `}
            >
              Content <EditIcon w='3' h='3' />
              <br />
            </span>
            <div
              css={css`
                margin-left: 0.5rem;
              `}
            >
              {!isEditingRecipeContent && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: recipeDetails?.recipe?.content ?? '',
                  }}
                />
              )}
            </div>
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
                    size='sm'
                    margin='0.5rem'
                    onClick={() => {
                      setIsEditingRecipeContent(false);
                      setRecipeContent(recipeDetails?.recipe?.content ?? '');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size='sm' margin='0.5rem' type='submit'>
                    Save
                  </Button>
                </div>
              )}
          </label>
        </form>
      </li>
      <li>
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
        {recipeDetails?.recipe?.ingredientQuantities?.map(
          ({ unit, amount, ingredient }) => {
            return (
              <div
                key={ingredient.id}
                css={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                `}
              >
                <li
                  css={css`
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-left: 0.5rem;
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
                      padding-right: 5px;
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
                      padding-right: 5px;
                    `}
                  >
                    <EditablePreview />
                    <EditableInput type='text' />
                  </Editable>
                  {ingredient.name}
                  <button
                    css={css`
                      display: flex;
                      align-items: center;
                      margin-left: 0.3rem;
                      height: 1.3rem;
                      :hover {
                        background-color: #f7c481;
                        border-radius: 60px;
                      }
                    `}
                    onClick={() => {
                      removeIngredientFromRecipe({
                        variables: {
                          ingredientId: ingredient.id,
                          recipeId,
                        },
                      });
                    }}
                  >
                    <SmallCloseIcon w='4' h='4' color='#fff' margin='0px 3px' />
                  </button>
                </li>
              </div>
            );
          }
        )}
      </li>
    </ul>
  );
};
