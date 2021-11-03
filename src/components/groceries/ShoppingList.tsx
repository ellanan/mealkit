/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import _ from 'lodash';
import { useQuery, useMutation, gql } from '@apollo/client';
import * as GraphQLTypes from '../../generated/graphql';
import { DateTime } from 'luxon';
import { Button, Spinner } from '@chakra-ui/react';
import createPersistedState from 'use-persisted-state';
import { DateRange } from 'react-date-range';
import Creatable from 'react-select/creatable';
import { HiOutlineTrash } from 'react-icons/hi';
import { useMemo } from 'react';

const useRawShoppingListPersistedState = createPersistedState('shopping list');

const useShoppingListPersistedState = () => {
  const [rawState, setRawState] = useRawShoppingListPersistedState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  return useMemo(() => {
    const startDate = rawState.startDate
      ? new Date(rawState.startDate)
      : DateTime.now().plus({ days: 1 }).toJSDate();

    const endDate = rawState.endDate
      ? new Date(rawState.endDate)
      : DateTime.now().plus({ weeks: 1 }).toJSDate();
    return [
      {
        startDate,
        endDate,
        key: 'shopping list range',
      },
      ({ startDate, endDate }: { startDate?: Date; endDate?: Date }) => {
        setRawState({
          startDate: startDate?.toISOString() ?? null,
          endDate: endDate?.toISOString() ?? null,
        });
      },
    ] as const;
  }, [rawState, setRawState]);
};

export const ShoppingList = () => {
  const [range, setRange] = useShoppingListPersistedState();

  const {
    data,
    error: errorGeneratingShoppingList,
    loading: loadingShoppingList,
  } = useQuery<
    GraphQLTypes.ShoppingListQuery,
    GraphQLTypes.ShoppingListQueryVariables
  >(
    gql`
      query ShoppingList($startDate: String!, $endDate: String!) {
        ingredientTypes {
          id
          name
        }
        currentUser {
          id
          mealPlan {
            id
            schedule(startDate: $startDate, endDate: $endDate) {
              id
              date
              mealType
              recipe {
                id
                name
                ingredientQuantities {
                  unit
                  amount
                  ingredient {
                    id
                    name
                    type {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        startDate: range.startDate.toISOString(),
        endDate: range.endDate.toISOString(),
      },
      skip: !range.startDate || !range.endDate,
    }
  );
  if (errorGeneratingShoppingList) {
    throw errorGeneratingShoppingList;
  }

  const [createIngredientType, { error: errorCreatingIngredientType }] =
    useMutation<
      GraphQLTypes.CreateIngredientTypeMutation,
      GraphQLTypes.CreateIngredientTypeMutationVariables
    >(gql`
      mutation CreateIngredientType($name: String!) {
        createIngredientType(name: $name) {
          id
          name
        }
      }
    `);
  if (errorCreatingIngredientType) {
    throw errorCreatingIngredientType;
  }

  const [updateIngredient, { error: errorUpdatingIngredient }] = useMutation<
    GraphQLTypes.UpdateIngredientMutation,
    GraphQLTypes.UpdateIngredientMutationVariables
  >(gql`
    mutation UpdateIngredient($ingredientId: ID!, $ingredientTypeId: ID!) {
      updateIngredient(
        ingredientId: $ingredientId
        ingredientTypeId: $ingredientTypeId
      ) {
        id
        name
        type {
          id
          name
        }
      }
    }
  `);
  if (errorUpdatingIngredient) {
    throw errorUpdatingIngredient;
  }

  const [deleteIngredientType, { error: errorDeletingIngredientType }] =
    useMutation<
      GraphQLTypes.DeleteIngredientTypeMutation,
      GraphQLTypes.DeleteIngredientTypeMutationVariables
    >(gql`
      mutation DeleteIngredientType($ingredientTypeId: ID!) {
        deleteIngredientType(ingredientTypeId: $ingredientTypeId) {
          id
        }
      }
    `);
  if (errorDeletingIngredientType) {
    throw errorDeletingIngredientType;
  }

  const ingredientQuantities = data?.currentUser?.mealPlan?.schedule
    .map((scheduledItem: any) => {
      return scheduledItem?.recipe?.ingredientQuantities ?? [];
    })
    .flat();

  return (
    <div className='flex flex-col m-4 text-14'>
      <DateRange
        className='flex items-center -mt-6'
        css={css`
          .rdrNextPrevButton {
            background-color: transparent;
          }
        `}
        weekStartsOn={1}
        editableDateInputs={false}
        moveRangeOnFirstSelection={false}
        ranges={[range]}
        showMonthAndYearPickers={false}
        showDateDisplay={false}
        rangeColors={['#f7af90']}
        onChange={(item) => {
          setRange(item[range.key]);
        }}
      />

      {loadingShoppingList ? (
        <div className='flex items-center justify-center italic text-base'>
          <Spinner className='text-sm mr-2' color='orange' size='md' />
          loading groceries...
        </div>
      ) : null}

      {Object.values(
        _.groupBy(
          ingredientQuantities,
          (ingredientQuantity) => ingredientQuantity.ingredient.type?.name
        )
      ).map((ingredientQuantities) => (
        <div
          key={ingredientQuantities[0].ingredient.type?.id ?? 'uncategorized'}
        >
          <div className='group flex items-center justify-center font-normal text-sm relative bg-27 uppercase py-1'>
            {ingredientQuantities[0].ingredient.type?.name ?? 'uncategorized'}
            <Button
              className='text-xs absolute right-0 opacity-0 disabled:opacity-0 group-hover:opacity-100 hover:bg-transparent hover:text-yellow-600 px-2'
              size='sm'
              variant='ghost'
              isDisabled={
                !ingredientQuantities[0].ingredient.type?.id ? true : false
              }
              onClick={(e) => {
                e.preventDefault();
                deleteIngredientType({
                  variables: {
                    ingredientTypeId:
                      ingredientQuantities[0].ingredient.type?.id,
                  },
                  update: (cache) => {
                    cache.modify({
                      id: cache.identify({
                        __typename: 'Query',
                      }),
                      fields: {
                        ingredientTypes: (ingredientTypes, { readField }) => {
                          return ingredientTypes.filter(
                            (ingredientType: any) =>
                              readField('id', ingredientType) !==
                              ingredientQuantities[0].ingredient.type?.id
                          );
                        },
                      },
                    });
                    ingredientQuantities.forEach(({ ingredient }) => {
                      cache.modify({
                        id: cache.identify(ingredient),
                        fields: {
                          type() {
                            return null;
                          },
                        },
                      });
                    });
                  },
                  optimisticResponse: {
                    deleteIngredientType: {
                      __typename: 'IngredientType',
                      id: ingredientQuantities[0].ingredient.type?.id,
                    },
                  },
                });
              }}
            >
              <HiOutlineTrash className='w-5' />
            </Button>
          </div>

          <ul className='mb-2 text-base list-disc'>
            {Object.values(
              _.groupBy(
                ingredientQuantities,
                (ingredientQuantity) =>
                  ingredientQuantity.ingredient.id + ingredientQuantity.unit
              )
            ).map((ingredientQuantities) => {
              return (
                <li
                  className='flex flex-row w-full group list-disc text-sm leading-loose px-1 font-Raleway'
                  key={
                    ingredientQuantities[0].ingredient.id +
                    ingredientQuantities[0].unit
                  }
                >
                  <span>
                    <span className='capitalize'>
                      {ingredientQuantities[0].ingredient.name}
                    </span>
                    <small>
                      <span className='ml-1'>
                        {_.sumBy(ingredientQuantities, (x) => x.amount)}
                      </span>
                      <span className='ml-1'>
                        {ingredientQuantities[0].unit}
                      </span>
                    </small>
                  </span>
                  <div className='ml-auto opacity-0 group-hover:opacity-100 focus-within:opacity-100 relative cursor-pointer'>
                    <span className='uppercase text-xs'>
                      set ingredient type
                    </span>
                    <Creatable
                      className='min-w-[150px] absolute top-0 right-0 leading-tight opacity-0 focus-within:opacity-100 '
                      styles={{
                        control: (base: any) => ({
                          ...base,
                          minHeight: 'auto',
                          cursor: 'pointer',
                        }),
                        indicatorSeparator: (base: any) => ({
                          display: 'none',
                        }),
                        dropdownIndicator: (base: any) => ({
                          ...base,
                          padding: '0 4px',
                        }),
                      }}
                      options={data?.ingredientTypes.map(({ id, name }) => ({
                        value: id,
                        label: name,
                        isDisabled:
                          id.startsWith('temp-id:') ||
                          id === ingredientQuantities[0].ingredient.type?.id,
                      }))}
                      isSearchable={true}
                      isClearable={true}
                      placeholder='type'
                      onChange={async (newValue, actionMeta) => {
                        if (!newValue || !newValue.value) {
                          console.log(`no newValue`, actionMeta);
                          return;
                        }

                        let ingredientTypeId;

                        if (actionMeta.action === 'create-option') {
                          const createIngredientTypeResult =
                            await createIngredientType({
                              variables: {
                                name: newValue.value,
                              },
                              update(cache, { data }) {
                                cache.modify({
                                  id: cache.identify({
                                    __typename: 'Query',
                                  }),
                                  fields: {
                                    ingredientTypes: (ingredientTypes) => {
                                      return ingredientTypes.concat(
                                        data?.createIngredientType
                                      );
                                    },
                                  },
                                });
                                cache.modify({
                                  id: cache.identify(
                                    ingredientQuantities[0].ingredient
                                  ),
                                  fields: {
                                    type(existingType, { toReference }) {
                                      return toReference({
                                        __typename: 'IngredientType',
                                        id: data?.createIngredientType?.id,
                                      });
                                    },
                                  },
                                });
                              },
                              optimisticResponse: {
                                createIngredientType: {
                                  __typename: 'IngredientType',
                                  id: `temp-id:${newValue.value}`,
                                  name: newValue.value,
                                },
                              },
                            });

                          if (
                            !createIngredientTypeResult.data
                              ?.createIngredientType
                          ) {
                            console.log(
                              'failed to create ingredient type',
                              createIngredientTypeResult
                            );
                            return;
                          }

                          ingredientTypeId =
                            createIngredientTypeResult.data.createIngredientType
                              .id;
                        } else {
                          ingredientTypeId = newValue.value;
                        }

                        await updateIngredient({
                          variables: {
                            ingredientId: ingredientQuantities[0].ingredient.id,
                            ingredientTypeId: ingredientTypeId,
                          },
                          update(cache, { data }) {
                            cache.modify({
                              id: cache.identify(
                                ingredientQuantities[0].ingredient
                              ),
                              fields: {
                                type(existingType, { toReference }) {
                                  return toReference({
                                    __typename: 'IngredientType',
                                    id: data?.updateIngredient?.type?.id,
                                  });
                                },
                              },
                            });
                          },
                          optimisticResponse: {
                            updateIngredient: {
                              __typename: 'Ingredient',
                              id: ingredientQuantities[0].ingredient.id,
                              name: ingredientQuantities[0].ingredient.name,
                              type: {
                                id: newValue.value,
                                name: newValue.label,
                              },
                            },
                          },
                        });
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
