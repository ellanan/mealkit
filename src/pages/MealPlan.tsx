import { DateTime, Interval } from 'luxon';
import { useQuery, gql } from '@apollo/client';
import * as GraphQLTypes from '../generated/graphql';
import { Fragment, useState } from 'react';

import { AddRecipeToMealPlanForm } from '../components/AddRecipeToMealPlanForm';

// @ts-ignore
window.DateTime = DateTime;

export const MealPlan = () => {
  const [mealTypeAndDate, setMealTypeAndDate] = useState<{
    mealType: GraphQLTypes.MealType | null;
    date: string | null;
  }>({
    mealType: null,
    date: null,
  });

  const startDate = DateTime.now().startOf('week');
  const endDate = startDate.endOf('week');

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
      <table>
        <thead>
          <tr>
            <th></th>
            {interval.map((day) => (
              <th key={day.toISO()}>
                <span>{day.weekdayShort}</span>
                <span>{day.day}</span>
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
                  <td key={day.toISO()} valign='top'>
                    <button
                      onClick={() => {
                        setMealTypeAndDate({
                          mealType,
                          date: day.toISODate(),
                        });
                      }}
                    >
                      add recipe to meal
                    </button>
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
