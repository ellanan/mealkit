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

const defaultImg = require('../images/defaultImg.jpg').default;

export const MealPlan = () => {
  const initRef = useRef<any>();

  const today = useMemo(() => DateTime.now(), []);

  const [startDate, setStartDate] = useState<DateTime>(today.startOf('week'));
  const [mealTypeAndDate, setMealTypeAndDate] = useState<{
    mealType: GraphQLTypes.MealType | null;
    date: string | null;
  }>({
    mealType: null,
    date: null,
  });
  const endDate = useMemo(() => startDate.endOf('week'), [startDate]);

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
    `
  );
  if (errorDeletingMealPlanEntry) {
    throw errorDeletingMealPlanEntry;
  }

  const cache = apolloClient.cache;

  const mealPlan = data?.currentUser?.mealPlan;

  return (
    <>
      <div
        css={css`
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-top: 1rem;
        `}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            setStartDate(today.startOf('week'));
          }}
          size={'sm'}
          css={css`
            background-color: #fff;
            color: #7e7979;
            border: 1px solid #7e7979;
            border-radius: 20px;
            margin: 0 1rem;

            :hover {
              background-color: #f3f0ed;
            }
          `}
        >
          Today
        </Button>
        <Button
          onClick={() => {
            setStartDate(startDate.minus({ weeks: 1 }));
          }}
          css={css`
            background-color: #fff;
            color: #7e7979;
            border-radius: 20px;
            height: 30px;
            width: 20px;
            box-shadow: none !important;

            :hover {
              background-color: #f3f0ed;
            }
          `}
        >
          <ChevronLeftIcon w={6} h={6} />
        </Button>
        <Button
          onClick={() => {
            setStartDate(startDate.plus({ weeks: 1 }));
          }}
          css={css`
            background-color: #fff;
            border-radius: 20px;
            color: #7e7979;
            height: 30px;
            width: 20px;
            box-shadow: none !important;

            :hover {
              background-color: #f3f0ed;
            }
          `}
        >
          <ChevronRightIcon w={6} h={6} />
        </Button>
        <span
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 30px;
            width: 280px;
            margin: 0 1.5em 0 1.5em;
            color: #646161;
            font-weight: 500;
            font-size: 18px;
            border-radius: 20px;
          `}
        >
          {`${interval[0].monthLong} ${interval[0].year}`}
        </span>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: flex-end;
            right: 0;
          `}
        >
          <NavLink
            to='/grocerylist'
            className='main-nav-link'
            activeClassName='active'
          >
            Shopping List
          </NavLink>
        </div>
      </div>
      <div
        css={css`
          display: flex;
          flex-shrink: 0;

          /* accommodate for the content below having as scrollbar;
          we need a scrollbar to take up the same amount of width, but we don't want to show it */
          overflow-y: scroll;
          ::-webkit-scrollbar {
            background: transparent;
          }
        `}
      >
        {interval.map((day) => {
          return (
            <div
              key={day.toISO()}
              css={css`
                padding: 0.7em 1.2em;
                color: #593e31;
                position: relative;
                flex-grow: 1;

                &:not(:last-child):after {
                  content: '';
                  display: block;
                  width: 1px;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  right: 0;
                  background-image: linear-gradient(
                    to bottom,
                    rgba(255, 255, 255, 0),
                    #f1e6e2 30%,
                    #f1e6e2
                  );
                }
              `}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                `}
              >
                <span
                  css={css`
                    font-size: 12px;
                    text-transform: uppercase;
                  `}
                >
                  {day.weekdayShort}
                </span>
                <span
                  css={css`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.6rem;
                    height: 1.5rem;
                    padding: 18px;
                    border-radius: 50px;
                    ${today.hasSame(day, 'day') &&
                    css`
                      color: #fff;
                      background-color: #f88c5a;
                    `};
                  `}
                >
                  {day.day}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div
        css={css`
          display: flex;
          overflow-y: scroll;
          flex-shrink: 1;
          flex-grow: 1;
        `}
      >
        {interval.map((day) => {
          return (
            <div
              key={day.toISO()}
              css={css`
                padding: 0.7em 1.2em;
                color: #593e31;
                position: relative;
                flex-grow: 1;

                &:not(:last-child):after {
                  content: '';
                  display: block;
                  width: 1px;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  right: 0;
                  background-image: linear-gradient(
                    to bottom,
                    #f1e6e2,
                    #f1e6e2 80%,
                    rgba(255, 255, 255, 0)
                  );
                }
              `}
            >
              {[
                GraphQLTypes.MealType.Breakfast,
                GraphQLTypes.MealType.Lunch,
                GraphQLTypes.MealType.Dinner,
              ].map((mealType) => {
                const mealPlanEntries = mealPlan?.schedule.filter((entry) => {
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
                            width='100'
                            border='none'
                            shadow='lg'
                            borderRadius='20px'
                          >
                            {data?.currentUser?.mealPlan?.id &&
                              mealTypeAndDate?.date &&
                              mealTypeAndDate?.mealType && (
                                <AddRecipeToMealPlanForm
                                  mealPlan={data.currentUser.mealPlan}
                                  date={mealTypeAndDate.date}
                                  mealType={mealTypeAndDate.mealType}
                                  autoFocusRef={initRef}
                                  onComplete={onClose}
                                />
                              )}
                          </PopoverContent>
                        </>
                      )}
                    </Popover>
                    {mealPlanEntries?.map((entry) => (
                      <div
                        key={entry.id}
                        css={css`
                          position: relative;
                          margin: 0.6em 0;

                          .deleteIndicator {
                            opacity: 0;
                          }
                          &:hover {
                            .deleteIndicator {
                              opacity: 1;
                              display: flex;
                              align-items: center;
                            }

                            .recipe-title {
                              background-image: linear-gradient(
                                to bottom,
                                rgba(0, 0, 0, 0),
                                rgba(0, 0, 0, 0.15) 30%,
                                rgba(0, 0, 0, 0.35)
                              );
                            }
                          }
                        `}
                      >
                        <div
                          css={css`
                            display: block;
                            position: relative;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.1);
                            padding-top: 100%;
                            margin-bottom: 6px;
                          `}
                        >
                          <NavLink
                            to={(location) => {
                              const newQueryParams = new URLSearchParams(
                                location.search
                              );
                              newQueryParams.set(
                                'modalRecipeId',
                                entry.recipe.id
                              );

                              return {
                                ...location,
                                search: newQueryParams.toString(),
                              };
                            }}
                          >
                            <img
                              src={entry.recipe.imageUrl ?? defaultImg}
                              alt=''
                              css={css`
                                position: absolute;
                                top: 0;
                                width: 100%;
                                height: 100%;
                                object-fit: cover;
                              `}
                            />
                            <div
                              className='recipe-title'
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
                                  rgba(92, 86, 86, 0.1) 30%,
                                  rgba(56, 54, 54, 0.3)
                                );
                                line-height: 1.2;
                                padding: 30px 8px 12px;
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
                        </div>
                        <Button
                          size='xs'
                          className='deleteIndicator'
                          variant='unstyled'
                          aria-label={`delete ${entry.recipe.name} from meal plan`}
                          disabled={!mealPlan}
                          onClick={(e) => {
                            e.preventDefault();
                            if (!mealPlan) return;
                            deleteMealPlanEntryMutation({
                              variables: {
                                mealPlanEntryId: entry.id,
                              },
                            });
                            // update cache before server mutation completes
                            cache.modify({
                              id: cache.identify(mealPlan),
                              fields: {
                                schedule(
                                  existingEntriesInSchedule,
                                  { readField }
                                ) {
                                  return existingEntriesInSchedule.filter(
                                    (existingEntry: any) =>
                                      readField('id', existingEntry) !==
                                      entry.id
                                  );
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
    </>
  );
};
