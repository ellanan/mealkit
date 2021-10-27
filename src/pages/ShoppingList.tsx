import { DateRange } from 'react-date-range';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../generated/graphql';
import { DateTime } from 'luxon';
import createPersistedState from 'use-persisted-state';
import { useMemo, useState } from 'react';
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
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const { data, error: errorGeneratingShoppingList } = useQuery<
    GraphQLTypes.ShoppingListQuery,
    GraphQLTypes.ShoppingListQueryVariables
  >(
    gql`
      query ShoppingList($startDate: String!, $endDate: String!) {
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

  const ingredientQuantities = data?.currentUser?.mealPlan?.schedule
    .map((scheduledItem) => {
      return scheduledItem?.recipe?.ingredientQuantities ?? [];
    })
    .flat();

  return (
    <div className='flex flex-col m-4 max-w-l text-14'>
      {showCalendar ? (
        <DateRange
          className='flex items-center mt-1'
          weekStartsOn={1}
          editableDateInputs={false}
          onChange={(item) => {
            setRange(item[range.key]);
          }}
          moveRangeOnFirstSelection={false}
          ranges={[range]}
          showMonthAndYearPickers={false}
          showDateDisplay={false}
          rangeColors={['#f7af90']}
        />
      ) : null}
      <button
        className='flex justify-start mb-3 font-semibold'
        onClick={() => setShowCalendar((prevState) => !prevState)}
      >
        {`Shopping list for ${[range.startDate.toLocaleDateString()]} to ${[
          range.endDate.toLocaleDateString(),
        ]}:`}
      </button>
      {Object.values(
        _.groupBy(
          ingredientQuantities,
          (ingredientQuantity) => ingredientQuantity.ingredient.type?.name
        )
      ).map((ingredientQuantities) => (
        <div
          key={ingredientQuantities[0].ingredient.type?.id ?? 'Uncategorized'}
        >
          <div className='font-medium text-s'>
            {ingredientQuantities[0].ingredient.type?.name ?? 'Uncategorized'}
          </div>
          <ul className='mb-2'>
            {Object.values(
              _.groupBy(
                ingredientQuantities,
                (ingredientQuantity) => ingredientQuantity.ingredient.id
              )
            ).map((ingredientQuantities) => {
              return (
                <li
                  className='ml-4'
                  key={ingredientQuantities[0].ingredient.id}
                >
                  {` - ${_.sumBy(ingredientQuantities, (x) => x.amount)}
                    ${ingredientQuantities[0].unit}
                    ${ingredientQuantities[0].ingredient.name}
                    `}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
};
