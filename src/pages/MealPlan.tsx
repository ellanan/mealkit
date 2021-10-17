/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DateTime, Interval } from 'luxon';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../generated/graphql';
import { Button } from '@chakra-ui/button';
import { useMemo, useState } from 'react';

import { AddRecipeToMealPlanForm } from '../components/AddRecipeToMealPlanForm';

export const MealPlan = () => {
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.now().startOf('week')
  );
  const endDate = useMemo(() => startDate.endOf('week'), [startDate]);
  const [mealTypeAndDate, setMealTypeAndDate] = useState<{
    mealType: GraphQLTypes.MealType | null;
    date: string | null;
  }>({
    mealType: null,
    date: null,
  });

  const interval = Interval.fromDateTimes(startDate, endDate)
    .splitBy({ days: 1 })
    .map((d: Interval) => d.start);

  const { data, error } = useQuery<
    GraphQLTypes.MealScheduleQuery,
    GraphQLTypes.MealScheduleQueryVariables
  >(
    gql`
      query MealSchedule($startDate: String!, $endDate: String!) {
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
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        startDate: startDate.toISO(),
        endDate: endDate.toISO(),
      },
    }
  );
  if (error) {
    throw error;
  }

  return (
    <>
      <h1>meal plan</h1>
      <h2>
        {interval[0].monthLong} {interval[0].year}
      </h2>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: space-between;
        `}
      >
        <Button
          onClick={() => {
            setStartDate(startDate.minus({ weeks: 1 }));
          }}
        >
          previous week
        </Button>
        <Button
          onClick={() => {
            setStartDate(startDate.plus({ weeks: 1 }));
          }}
        >
          next week
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            <th />
            {interval.map((day) => (
              <th key={day.toISO()}>
                <span>{`${day.weekdayShort} - ${day.monthShort} ${day.day}`}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            GraphQLTypes.MealType.Breakfast,
            GraphQLTypes.MealType.Lunch,
            GraphQLTypes.MealType.Dinner,
          ].map((mealType) => (
            <tr key={mealType}>
              <td valign='top'>{mealType}</td>
              {interval.map((day) => {
                const mealPlanEntries =
                  data?.currentUser?.mealPlan?.schedule.filter((entry) => {
                    return (
                      entry?.mealType === mealType &&
                      entry.date &&
                      day.toISODate() ===
                        DateTime.fromISO(entry.date, {
                          setZone: true,
                        }).toISODate()
                    );
                  });
                return (
                  <td
                    key={day.toISO()}
                    valign='top'
                    css={css`
                      .addRecipe {
                        opacity: 0;
                      }
                      &:hover .addRecipe {
                        opacity: 1;
                      }
                    `}
                  >
                    <Button
                      className='addRecipe'
                      onClick={() => {
                        setMealTypeAndDate({
                          mealType,
                          date: day.toISODate(),
                        });
                      }}
                    >
                      add recipe to meal
                    </Button>
                    {mealPlanEntries?.map((entry) => (
                      <div key={entry?.id}>{entry?.recipe?.name}</div>
                    ))}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {JSON.stringify({ mealTypeAndDate })}
      {data?.currentUser?.mealPlan?.id &&
        mealTypeAndDate?.date &&
        mealTypeAndDate?.mealType && (
          <AddRecipeToMealPlanForm
            mealPlanId={data?.currentUser?.mealPlan?.id}
            date={mealTypeAndDate.date}
            mealType={mealTypeAndDate.mealType}
          />
        )}
    </>
  );
};
