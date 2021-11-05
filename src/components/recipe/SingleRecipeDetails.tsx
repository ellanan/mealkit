import { useMutation, gql, useQuery } from '@apollo/client';
import type * as GraphQLTypes from '../../generated/graphql';
import Creatable from 'react-select/creatable';
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Spinner,
  ModalCloseButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { SmallCloseIcon, EditIcon } from '@chakra-ui/icons';
import { HiOutlineTrash } from 'react-icons/hi';
import { Editor } from '@tinymce/tinymce-react';
import { useState, useRef } from 'react';

export const SingleRecipeDetails = ({
  recipeId,
  onClose,
}: {
  recipeId: string;
  onClose?: () => void;
}) => {
  const [isEditingRecipeContent, setIsEditingRecipeContent] =
    useState<boolean>(false);

  const [recipeContent, setRecipeContent] = useState<string>('');

  const [isDeleteRecipeOpen, setIsDeleteRecipeOpen] = useState<boolean>(false);
  const cancelDeleteRecipeRef = useRef<any>();

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
        currentUser {
          id
          mealPlan {
            id
          }
        }

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

  const [deleteRecipe, { error: errorDeletingRecipe }] = useMutation<
    GraphQLTypes.DeleteRecipeMutation,
    GraphQLTypes.DeleteRecipeMutationVariables
  >(gql`
    mutation DeleteRecipe($recipeId: ID!) {
      deleteRecipe(recipeId: $recipeId) {
        id
      }
    }
  `);
  if (errorDeletingRecipe) {
    throw errorDeletingRecipe;
  }

  const [
    addIngredientQuantityToRecipe,
    {
      error: errorAddingIngredientQuantity,
      loading: loadingIngredientQuantity,
    },
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

  const [
    removeIngredientFromRecipe,
    { error: errorRemovingIngredient, loading: removingIngredient },
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
      <div className='flex justify-center items-center flex-grow'>
        <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='orange'
          size='xl'
        />
      </div>
    );
  }

  return (
    <>
      <ul className='m-4 text-14 flex-grow'>
        <li className='flex items-center mb-4'>
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
          <Button
            className='ml-4'
            type='button'
            variant='ghost'
            colorScheme='orange'
            size={'sm'}
            onClick={() => setIsDeleteRecipeOpen(true)}
          >
            <HiOutlineTrash width={12} height={12} />
          </Button>
          <AlertDialog
            isOpen={isDeleteRecipeOpen}
            leastDestructiveRef={cancelDeleteRecipeRef}
            onClose={() => setIsDeleteRecipeOpen(false)}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  Delete Recipe
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete this recipe permeantly?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={cancelDeleteRecipeRef}
                    size={'sm'}
                    onClick={(e) => setIsDeleteRecipeOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme='red'
                    size={'sm'}
                    ml={3}
                    onClick={(e) => {
                      e.preventDefault();
                      deleteRecipe({
                        variables: {
                          recipeId,
                        },
                        update: (cache) => {
                          cache.modify({
                            id: cache.identify({
                              __typename: 'Query',
                            }),
                            fields: {
                              recipes(existingRecipes, { readField }) {
                                return existingRecipes.filter(
                                  (existingRecipe: any) =>
                                    readField('id', existingRecipe) !== recipeId
                                );
                              },
                            },
                          });

                          if (!recipeDetails?.currentUser?.mealPlan) return;

                          cache.modify({
                            id: cache.identify(
                              recipeDetails.currentUser.mealPlan
                            ),
                            fields: {
                              schedule(existingSchedule, { readField }) {
                                return existingSchedule.filter(
                                  (entry: any) =>
                                    readField(
                                      'id',
                                      readField('recipe', entry)
                                    ) !== recipeId
                                );
                              },
                            },
                          });
                        },
                        optimisticResponse: {
                          deleteRecipe: {
                            __typename: 'Recipe',
                            id: recipeId,
                          },
                        },
                      });

                      onClose?.();
                    }}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>

          <ModalCloseButton />
        </li>
        <li>
          {recipeDetails?.recipe?.imageUrl && (
            <img
              className='max-h-xs max-w-xs object-cover mb-2 rounded-md'
              src={recipeDetails.recipe.imageUrl}
              alt=''
            />
          )}
          <input
            className='mb-4 text-xs text-transparent'
            type='file'
            name='test'
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
        <li className='mb-4'>
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
              className='relative'
              tabIndex={0}
              onClick={() => {
                if (!isEditingRecipeContent) {
                  setIsEditingRecipeContent(true);
                }
              }}
            >
              <span className='font-semibold'>
                Content <EditIcon w='3' h='3' />
                <br />
              </span>
              <div className='ml-2'>
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
            <span className='font-semibold'>
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
                      amount: 1,
                      unit: 'g',
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
          <div>
            {loadingIngredientQuantity ? (
              <>
                <Spinner
                  thickness='2px'
                  speed='0.65s'
                  emptyColor='gray.200'
                  color='orange'
                  size='xs'
                />
                <i className='text-sm ml-1'>adding ingredient</i>
              </>
            ) : null}
          </div>
          {recipeDetails?.recipe?.ingredientQuantities?.map(
            ({ unit, amount, ingredient }) => {
              return (
                <div
                  className='flex flex-row items-center group px-1'
                  key={ingredient.id}
                >
                  <Editable
                    className='pr-1'
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
                  >
                    <EditablePreview />
                    <EditableInput type='number' />
                  </Editable>
                  <Editable
                    className='pr-1'
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
                  >
                    <EditablePreview />
                    <EditableInput type='text' />
                  </Editable>
                  {ingredient.name}
                  <button
                    className='flex items-center opacity-0 group-hover:opacity-100'
                    onClick={() => {
                      removeIngredientFromRecipe({
                        variables: {
                          ingredientId: ingredient.id,
                          recipeId,
                        },
                      });
                    }}
                  >
                    {removingIngredient ? (
                      <>
                        <Spinner
                          className='ml-1'
                          thickness='2px'
                          speed='0.65s'
                          emptyColor='gray.200'
                          color='orange'
                          size='xs'
                        />
                        <i className='text-sm ml-1'>removing ingredient</i>
                      </>
                    ) : (
                      <SmallCloseIcon
                        className='rounded-2xl'
                        w='4'
                        h='4'
                        color='#ebaf55'
                        margin='0px 3px'
                        _hover={{ bg: '#ee941f', color: '#fff' }}
                      />
                    )}
                  </button>
                </div>
              );
            }
          )}
        </li>
      </ul>
    </>
  );
};
