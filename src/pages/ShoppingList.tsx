import { DateRange } from 'react-date-range';
import { useQuery, useMutation, gql } from '@apollo/client';
import * as GraphQLTypes from '../generated/graphql';
import { DateTime } from 'luxon';
import { Spinner } from '@chakra-ui/react';
import createPersistedState from 'use-persisted-state';
import Creatable from 'react-select/creatable';
import { useMemo } from 'react';
import _ from 'lodash';

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

  const ingredientQuantities = data?.currentUser?.mealPlan?.schedule
    .map((scheduledItem: any) => {
      return scheduledItem?.recipe?.ingredientQuantities ?? [];
    })
    .flat();

  return (
    <div className='flex flex-col m-4 max-w-l text-14'>
      <DateRange
        className='flex items-center mt-1'
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
      <div className='mb-3 font-medium text-lg'>
        {`Shopping list for ${[range.startDate.toLocaleDateString()]} to ${[
          range.endDate.toLocaleDateString(),
        ]}:`}
      </div>

      {loadingShoppingList ? (
        <div className='flex items-center justify-center italic text-base'>
          <Spinner color='orange' size='md' />
          loading shopping list...
        </div>
      ) : null}

      {Object.values(
        _.groupBy(
          ingredientQuantities,
          (ingredientQuantity) => ingredientQuantity.ingredient.type?.name
        )
      ).map((ingredientQuantities) => (
        <div
          key={ingredientQuantities[0].ingredient.type?.id ?? 'Uncategorized'}
        >
          <div className='flex items-center justify-center font-normal text-base bg-27'>
            {ingredientQuantities[0].ingredient.type?.name ?? 'Uncategorized'}
          </div>
          <ul className='mb-2 text-base'>
            {Object.values(
              _.groupBy(
                ingredientQuantities,
                (ingredientQuantity) =>
                  ingredientQuantity.ingredient.id + ingredientQuantity.unit
              )
            ).map((ingredientQuantities) => {
              return (
                <li
                  className='flex flex-row ml-4 w-full group'
                  key={
                    ingredientQuantities[0].ingredient.id +
                    ingredientQuantities[0].unit
                  }
                >
                  {` - ${_.sumBy(ingredientQuantities, (x) => x.amount)}
                    ${ingredientQuantities[0].unit}
                    ${ingredientQuantities[0].ingredient.name}
                    `}

                  <Creatable
                    className='ml-auto mr-4 min-w-[150px] opacity-0 group-hover:opacity-100 focus-within:opacity-100'
                    options={data?.ingredientTypes.map(({ id, name }) => ({
                      value: id,
                      label: name,
                    }))}
                    isSearchable={true}
                    isClearable={true}
                    placeholder='type'
                    onChange={async (newValue, actionMeta) => {
                      if (!newValue || !newValue.value) {
                        console.log(`no newValue`, actionMeta);
                        return;
                      }

                      if (actionMeta.action === 'create-option') {
                        const createIngredientTypeResult =
                          await createIngredientType({
                            variables: {
                              name: newValue.value,
                            },
                          });

                        if (
                          !createIngredientTypeResult.data?.createIngredientType
                        ) {
                          console.log(
                            'failed to create ingredient type',
                            createIngredientTypeResult
                          );
                          return;
                        }
                      }

                      if (actionMeta.action === 'select-option') {
                        const updateIngredientResult = await updateIngredient({
                          variables: {
                            ingredientId: ingredientQuantities[0].ingredient.id,
                            ingredientTypeId: newValue.value,
                          },
                        });
                        return updateIngredientResult;
                      }
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
