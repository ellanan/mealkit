/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
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

  const { data, error } = useQuery<
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
  if (error) {
    throw error;
  }

  const ingredientQuantities = data?.currentUser?.mealPlan?.schedule
    .map((scheduledItem) => {
      return scheduledItem?.recipe?.ingredientQuantities ?? [];
    })
    .flat();

  return (
    <>
      <button onClick={() => setShowCalendar((prevState) => !prevState)}>
        {`shopping list for ${[range.startDate.toLocaleDateString()]} to ${[
          range.endDate.toLocaleDateString(),
        ]}`}
      </button>
      {showCalendar ? (
        <DateRange
          weekStartsOn={1}
          editableDateInputs={false}
          onChange={(item) => {
            setRange(item[range.key]);
          }}
          moveRangeOnFirstSelection={false}
          ranges={[range]}
          showMonthAndYearPickers={false}
          showDateDisplay={false}
          rangeColors={['#ebb39b']}
        />
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
          <div
            css={css`
              font-weight: 700;
            `}
          >
            {ingredientQuantities[0].ingredient.type?.name ?? 'uncategorized'}
          </div>

          <ul>
            {Object.values(
              _.groupBy(
                ingredientQuantities,
                (ingredientQuantity) => ingredientQuantity.ingredient.id
              )
            ).map((ingredientQuantities) => {
              return (
                <li
                  key={ingredientQuantities[0].ingredient.id}
                  css={css`
                    margin-left: 1em;
                  `}
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
    </>
  );
};
