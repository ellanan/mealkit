/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { DateTime, Interval } from 'luxon';
import { useQuery, gql, useMutation } from '@apollo/client';
import * as GraphQLTypes from '../generated/graphql';
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
} from '@chakra-ui/react';
import {
  AddIcon,
  CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import { NavLink } from 'react-router-dom';
import { useMemo, useState, useRef } from 'react';

import { AddRecipeToMealPlanForm } from '../components/AddRecipeToMealPlanForm';
import { ShoppingList } from './ShoppingList';

export const MealPlan = () => {
  const initRef = useRef<any>();

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

  const [
    deleteMealPlanEntryMutation,
    { error: errorDeletingMealPlanEntry, client: apolloClient },
  ] = useMutation<
    GraphQLTypes.DeleteMealPlanEntryMutationMutation,
    GraphQLTypes.DeleteMealPlanEntryMutationMutationVariables
  >(
    gql`
      mutation DeleteMealPlanEntryMutation($mealPlanEntryId: ID!) {
        deleteMealPlanEntry(mealPlanEntryId: $mealPlanEntryId) {
          id
        }
      }
    `,
    {
      onCompleted(response) {
        if (!data?.currentUser?.mealPlan) return;
        const cache = apolloClient.cache;
        cache.modify({
          id: cache.identify(data.currentUser.mealPlan),
          fields: {
            schedule(existingEntriesInSchedule, { readField }) {
              return existingEntriesInSchedule.filter(
                (existingEntry: any) =>
                  readField('id', existingEntry) !==
                  response.deleteMealPlanEntry?.id
              );
            },
          },
        });
      },
    }
  );
  if (errorDeletingMealPlanEntry) {
    throw errorDeletingMealPlanEntry;
  }

  return (
    <div>
      <h1>meal plan</h1>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <Button
          onClick={() => {
            setStartDate(startDate.minus({ weeks: 1 }));
          }}
          css={css`
            background-color: #fff;
            color: #f7894d;
            border-radius: 20px;
            height: 30px;
            width: 20px;
            box-shadow: none !important;
            :hover {
              background-color: #f8dfd2;
            }
          `}
        >
          <ChevronLeftIcon w={6} h={6} />
        </Button>
        <h2
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 1.5em 0 1.5em;
            color: #f7894d;
            font-weight: 600;
            border-radius: 20px;
            height: 30px;
            width: 280px;
          `}
        >
          {`${interval[0].toISODate()} to ${interval[6].toISODate()}`}
        </h2>
        <Button
          onClick={() => {
            setStartDate(startDate.plus({ weeks: 1 }));
          }}
          css={css`
            background-color: #fff;
            color: #f7894d;
            border-radius: 20px;
            height: 30px;
            width: 20px;
            box-shadow: none !important;
            :hover {
              background-color: #f8dfd2;
            }
          `}
        >
          <ChevronRightIcon w={6} h={6} />
        </Button>
      </div>
      <div
        css={css`
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        `}
      >
        {interval.map((day) => {
          return (
            <div
              key={day.toISO()}
              css={css`
                background-color: #faf1ed;
                border-radius: 14px;
                padding: 0.7em;
                margin: 0.2em;
                color: #593e31; ;
              `}
            >
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
                    <Popover
                      placement={'auto-start'}
                      isLazy={true}
                      autoFocus={true}
                      closeOnBlur={true}
                      initialFocusRef={initRef}
                    >
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
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
                              <AddIcon
                                className='addIndicator'
                                w={2}
                                h={2}
                                ml={1}
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            css={css`
                              border-radius: 5%;
                              border: 2px solid #ebb59c;
                            `}
                          >
                            {data?.currentUser?.mealPlan?.id &&
                              mealTypeAndDate?.date &&
                              mealTypeAndDate?.mealType && (
                                <AddRecipeToMealPlanForm
                                  mealPlan={data.currentUser.mealPlan}
                                  // mealPlanId={data?.currentUser?.mealPlan?.id}
                                  date={mealTypeAndDate.date}
                                  mealType={mealTypeAndDate.mealType}
                                  autoFocusRef={initRef}
                                  onComplete={onClose}
                                />
                              )}
                            <PopoverCloseButton>
                              <CloseIcon />
                            </PopoverCloseButton>
                          </PopoverContent>
                        </>
                      )}
                    </Popover>
                    {mealPlanEntries?.map((entry) => (
                      <div
                        key={entry.id}
                        css={css`
                          position: relative;

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
                        <NavLink
                          to={`/recipes/${entry.recipe.id}`}
                          css={css`
                            display: block;
                            position: relative;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.1);
                            padding-top: 100%;
                          `}
                        >
                          {entry.recipe.imageUrl !== null && (
                            <img
                              src={entry.recipe.imageUrl}
                              alt={`${entry.recipe.name}`}
                              css={css`
                                position: absolute;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                              `}
                            />
                          )}
                          <div
                            css={css`
                              position: absolute;
                              bottom: 0;
                              display: flex;
                              color: #ffffff;
                              font-weight: 500;
                              width: 100%;
                              background-image: linear-gradient(
                                to bottom,
                                rgba(0, 0, 0, 0),
                                rgba(0, 0, 0, 0.14) 30%,
                                rgba(0, 0, 0, 0.3)
                              );
                              line-height: 1.2;
                              padding: 30px 8px 12px;
                              &:hover {
                                background-image: linear-gradient(
                                  to bottom,
                                  rgba(0, 0, 0, 0),
                                  rgba(0, 0, 0, 0.2) 30%,
                                  rgba(0, 0, 0, 0.4)
                                );
                              }
                            `}
                          >
                            <span
                              css={css`
                                text-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
                              `}
                            >
                              {entry.recipe.name}
                            </span>
                          </div>
                        </NavLink>
                        <Button
                          size='xs'
                          className='deleteIndicator'
                          variant='unstyled'
                          aria-label={`delete ${entry.recipe.name} from meal plan`}
                          onClick={(e) => {
                            e.preventDefault();
                            deleteMealPlanEntryMutation({
                              variables: {
                                mealPlanEntryId: entry.id,
                              },
                              optimisticResponse: {
                                deleteMealPlanEntry: {
                                  id: entry.id,
                                  __typename: entry.__typename,
                                },
                              },
                            });
                          }}
                          css={css`
                            position: absolute;
                            top: 0;
                            right: 0;
                            transform: translate3d(30%, -30%, 0);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            &:hover {
                              .closeBackground {
                                transform: scale(1.05);
                              }
                            }
                          `}
                        >
                          <div
                            className='closeBackground'
                            css={css`
                              position: absolute;
                              top: 0;
                              right: 0;
                              width: 100%;
                              height: 100%;
                              background-color: rgba(0, 0, 0, 0.8);
                              border-radius: 50%;
                            `}
                          />
                          <CloseIcon
                            position='relative'
                            w={2}
                            h={2}
                            color='#ffffff'
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <ShoppingList />
    </div>
  );
};
