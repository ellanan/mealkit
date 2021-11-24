import { useMutation, gql, useQuery } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
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

export const CreateRecipe = ({ onClose }: { onClose?: () => void }) => {
  const [formData, setFormData] =
    useState<CreateRecipeForm>(initalFormDataState);

  const {
    data: dataForCreateRecipe,
    error: errorLoadingIngredients,
    loading: isLoadingDataForCreateRecipe,
  } = useQuery<GraphQLTypes.DataForCreateRecipeQuery>(gql`
    query DataForCreateRecipe {
      currentUser {
        id
        mealPlan {
          id
          ingredients {
            id
            name
          }
        }
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
        ...RecipeInList
      }
    }
    ${GraphQLTypes.RecipeInListFragmentDoc}
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
    <div className='m-4 text-14'>
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
            update: (cache, { data }) => {
              if (!dataForCreateRecipe?.currentUser?.mealPlan) return;
              cache.modify({
                id: cache.identify(dataForCreateRecipe.currentUser.mealPlan),
                fields: {
                  recipes(existingRecipes) {
                    return [data?.createRecipe].concat(existingRecipes);
                  },
                },
              });
            },
            optimisticResponse: {
              createRecipe: {
                __typename: 'Recipe',
                id: `temp-id:${formData.recipeName}`,
                name: formData.recipeName,
                imageUrl: formData.imageUrl,
                category: {
                  __typename: 'RecipeCategory',
                  id: 'temp-id:category',
                  name: 'temp-name:category',
                },
              },
            },
          });
          setFormData(initalFormDataState);
          onClose?.();
        }}
      >
        <ul>
          <li className='font-semibold mb-4'>
            <FormControl id='recipeName'>
              <FormLabel fontWeight={600}>Recipe Name</FormLabel>
              <Input
                type='text'
                width='50%'
                value={formData.recipeName}
                autoFocus={true}
                onChange={(e) => {
                  const recipeName = e.target.value;
                  setFormData((prev) => {
                    return { ...prev, recipeName };
                  });
                }}
              />
            </FormControl>
          </li>
          <li className='font-semibold mb-4'>
            <label>
              Image <br />
              <img
                className='max-h-72 max-w-72 object-cover mb-2 rounded-md'
                src={formData.imageUrl ?? ''}
                alt=''
              />
              <input
                className='text-xs text-transparent'
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
                  )
                    .then((response) => response.json())
                    .catch((error) => console.log('error', error));
                  console.log(response);

                  setFormData((prev) => ({
                    ...prev,
                    imageUrl: response.data?.link,
                  }));
                }}
              />
            </label>
          </li>
          <li className='font-semibold mb-4 relative'>
            <label>
              Content <br />
              <Editor
                apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
                value={formData.content}
                init={{
                  height: 200,
                  display: 'none',
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
          <li className='mb-4'>
            <label>
              <span className='font-semibold'>Ingredients</span>
              <Creatable
                options={dataForCreateRecipe?.currentUser?.mealPlan?.ingredients?.map(
                  (ingredient) => {
                    return { value: ingredient.id, label: ingredient.name };
                  }
                )}
                isOptionDisabled={({ value }) =>
                  formData.ingredientQuantities.some(
                    ({ ingredient }) => ingredient.id === value
                  ) || value.startsWith('temp-id:')
                }
                isSearchable
                menuPlacement='top'
                isLoading={isLoadingDataForCreateRecipe}
                placeholder='add ingredient'
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
                      update: (cache, { data }) => {
                        if (!dataForCreateRecipe?.currentUser?.mealPlan) return;
                        cache.modify({
                          id: cache.identify(
                            dataForCreateRecipe.currentUser.mealPlan
                          ),
                          fields: {
                            ingredients(existingIngredients) {
                              return [data?.createIngredient].concat(
                                existingIngredients
                              );
                            },
                          },
                        });
                      },
                      optimisticResponse: {
                        createIngredient: {
                          __typename: 'Ingredient',
                          id: `temp-id:${newValue.value}`,
                          name: newValue.value,
                        },
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
                  const newIngredient =
                    dataForCreateRecipe?.currentUser?.mealPlan?.ingredients?.find(
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
              />
            </label>
            <ul>
              {formData.ingredientQuantities.map(
                ({ unit, amount, ingredient }) => {
                  return (
                    <div
                      className='flex flex-row items-center ml-4 mt-2'
                      key={ingredient.id}
                    >
                      <li className='min-w-[30rem]'>
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
