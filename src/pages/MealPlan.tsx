/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DateTime, Interval } from 'luxon';
import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Fragment } from 'react';

export const MealPlan = () => {
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
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <h2>
          {interval[0].monthLong} {interval[0].year}
        </h2>
      </div>
      <table>
        <thead>
          <tr>
            {interval.map((day) => (
              <th key={day.toISO()}>
                <span>{day.weekdayShort}</span>
                <span>{day.day}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {['BREAKFAST', 'LUNCH', 'DINNER'].map((mealType) => (
            <Fragment key={mealType}>
              <tr>
                <td colSpan={interval.length}>{mealType}</td>
              </tr>
              <tr>
                {interval.map((day) => {
                  const mealPlanEntries =
                    data?.currentUser?.mealPlan?.schedule.filter((entry) => {
                      return (
                        entry?.mealType === mealType &&
                        entry.date &&
                        day.toISODate() ===
                          DateTime.fromISO(entry.date).toISODate()
                      );
                    });
                  return (
                    <td key={day.toISO()}>
                      {mealPlanEntries?.map((entry) => (
                        <div key={entry?.id}>{entry?.recipe?.name}</div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            </Fragment>
          ))}
        </tbody>
      </table>
    </>
  );
};
