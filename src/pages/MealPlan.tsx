/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DateTime, Interval } from 'luxon';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as GraphQLTypes from '../generated/graphql';
import { Button } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { useMemo, useState } from 'react';

import { AddRecipeToMealPlanForm } from '../components/AddRecipeToMealPlanForm';
import { ShoppingList } from './ShoppingList';

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
                imageUrl
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

  const [deleteMealPlanEntryMutation, { error: errorDeletingMealPlanEntry }] =
    useMutation<
      GraphQLTypes.DeleteMealPlanEntryMutationMutation,
      GraphQLTypes.DeleteMealPlanEntryMutationMutationVariables
    >(gql`
      mutation DeleteMealPlanEntryMutation($mealPlanId: ID!) {
        deleteMealPlanEntry(mealPlanId: $mealPlanId) {
          id
        }
      }
    `);
  if (errorDeletingMealPlanEntry) {
    throw errorDeletingMealPlanEntry;
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
      <div
        css={css`
          display: flex;
          flex-direction: row;
        `}
      >
        {interval.map((day) => {
          return (
            <div key={day.toISO()}>
              <h2>{`${day.weekdayShort} - ${day.monthShort} ${day.day}`}</h2>
              {[
                GraphQLTypes.MealType.Breakfast,
                GraphQLTypes.MealType.Lunch,
                GraphQLTypes.MealType.Dinner,
              ].map((mealType) => {
                const mealPlanEntries =
                  data?.currentUser?.mealPlan?.schedule.filter((entry) => {
                    return (
                      entry.mealType === mealType &&
                      entry.date &&
                      day.toISODate() ===
                        DateTime.fromISO(entry.date, {
                          setZone: true,
                        }).toISODate()
                    );
                  });
                return (
                  <div
                    key={mealType}
                    css={css`
                      .addIndicator {
                        opacity: 0;
                      }
                      &:hover .addIndicator {
                        opacity: 1;
                      }
                    `}
                  >
                    <Button
                      size='xs'
                      variant='unstyled'
                      onClick={() => {
                        setMealTypeAndDate({
                          mealType,
                          date: day.toISODate(),
                        });
                      }}
                      aria-label={`add recipe to ${mealType}`}
                      display='flex'
                    >
                      {mealType}
                      <AddIcon className='addIndicator' w={2} h={2} ml={1} />
                    </Button>

                    {mealPlanEntries?.map((entry) => (
                      <div
                        key={entry.id}
                        css={css`
                          display: flex;
                          flex-direction: column;
                        `}
                      >
                        {entry.recipe.imageUrl !== null && (
                          <img
                            src={entry.recipe.imageUrl}
                            alt={`${entry.recipe.name}`}
                            width={100}
                            height={100}
                            style={{ borderRadius: '10px' }}
                          />
                        )}
                        <div
                          css={css`
                            display: flex;
                          `}
                        >
                          {entry.recipe.name}
                          <NavLink to={`/recipes/${entry.recipe.id}`}>
                            <div
                              css={css`
                                .viewIndicator {
                                  opacity: 0;
                                }
                                &:hover .viewIndicator {
                                  opacity: 1;
                                }
                              `}
                            >
                              <ViewIcon
                                className='viewIndicator'
                                w={3}
                                h={3}
                                ml={1}
                              />
                            </div>
                          </NavLink>
                          <div
                            css={css`
                              .deleteIndicator {
                                opacity: 0;
                              }
                              &:hover .deleteIndicator {
                                opacity: 1;
                                display: flex;
                                align-items: center;
                              }
                            `}
                          >
                            <Button
                              size='xs'
                              variant='unstyled'
                              aria-label={`delete ${entry.recipe.name} from meal plan`}
                              onClick={(e) => {
                                e.preventDefault();
                                deleteMealPlanEntryMutation({
                                  variables: {
                                    mealPlanId: entry.id,
                                  },
                                });
                              }}
                            >
                              <DeleteIcon
                                className='deleteIndicator'
                                w={3}
                                h={3}
                                ml={1}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {data?.currentUser?.mealPlan?.id &&
        mealTypeAndDate?.date &&
        mealTypeAndDate?.mealType && (
          <AddRecipeToMealPlanForm
            mealPlanId={data?.currentUser?.mealPlan?.id}
            date={mealTypeAndDate.date}
            mealType={mealTypeAndDate.mealType}
          />
        )}
      <ShoppingList />
    </>
  );
};
