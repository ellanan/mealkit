/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import classnames from 'classnames';
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
      <div className='flex items-center justify-start pt-4'>
        <Button
          className='text-11 my-0 mx-4 ounded-full border-solid focus:shadow-none hover:bg-12'
          onClick={(e) => {
            e.preventDefault();
            setStartDate(today.startOf('week'));
          }}
          size={'sm'}
        >
          Today
        </Button>
        <Button
          className='bg-white text-11 rounded-full h-7 w-4 focus:shadow-none hover:bg-12'
          onClick={() => {
            setStartDate(startDate.minus({ weeks: 1 }));
          }}
        >
          <ChevronLeftIcon w={6} h={6} />
        </Button>
        <Button
          className='bg-white text-11 rounded-full h-7 w-4 focus:shadow-none hover:bg-12'
          onClick={() => {
            setStartDate(startDate.plus({ weeks: 1 }));
          }}
        >
          <ChevronRightIcon w={6} h={6} />
        </Button>
        <span className='flex items-center justify-start text-13 my-0 mx-6 font-medium text-xl'>
          {`${interval[0].monthLong} ${interval[0].year}`}
        </span>
        <NavLink
          className='ml-auto mr-8 rounded-full text-13 text-sm py-1 px-2 border border-13'
          to={(location) => {
            const newQueryParams = new URLSearchParams(location.search);
            newQueryParams.append('shoppingList', 'visible');

            return {
              ...location,
              search: newQueryParams.toString(),
            };
          }}
        >
          Shopping List
        </NavLink>
      </div>

      <div
        className='flex flex-shrink-0 overflow-y-scroll'
        css={css`
          /* accommodate for the content below having as scrollbar;
             we need a scrollbar to take up the same amount of width, but we don't want to show it */
          ::-webkit-scrollbar {
            background: transparent;
          }
        `}
      >
        {interval.map((day) => {
          return (
            <div
              className='relative flex-grow py-3 px-5 text-14'
              key={day.toISO()}
              css={css`
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
              <div className='flex flex-col items-center justify-center'>
                <span className='text-xs uppercase'>{day.weekdayShort}</span>
                <span
                  className={classnames(
                    'flex items-center justify-center rounded-3xl p-4 h-7 w-7',
                    today.hasSame(day, 'day') && 'bg-[#f88c5a] text-white'
                  )}
                >
                  {day.day}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex overflow-y-scroll flex-shrink flex-grow mb-5'>
        {interval.map((day) => {
          return (
            <div
              key={day.toISO()}
              className={[
                'flex-grow relative px-5 py-3 text-14',
                'after:block after:w-[1px] after:h-full after:absolute after:top-0 after:right-0',
              ].join(' ')}
              css={css`
                &:not(:last-child):after {
                  content: '';
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
                  <div key={mealType}>
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
                              className='group focus:shadow-none'
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
                                className='opacity-0 group-hover:opacity-100 ml-1'
                                w={2}
                                h={2}
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
                        className='relative my-2 mx-0'
                        css={css`
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
                        <div className='relative rounded-xl overflow-hidden mb-2 shadow-sm hover:shadow-md pt-[100%]'>
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
                              className='absolute top-0 w-full h-full object-cover'
                              src={entry.recipe.imageUrl ?? defaultImg}
                              alt=''
                            />
                            <div
                              className='recipe-title absolute bottom-0 flex text-white font-medium w-full leading-tight px-2 pt-8 pb-3'
                              css={css`
                                background-image: linear-gradient(
                                  to bottom,
                                  rgba(0, 0, 0, 0),
                                  rgba(92, 86, 86, 0.1) 30%,
                                  rgba(56, 54, 54, 0.3)
                                );
                              `}
                            >
                              {entry.recipe.name}
                            </div>
                          </NavLink>
                        </div>
                        <Button
                          className='deleteIndicator translate-x-1/3 -translate-y-1/3 absolute top-0 right-0 flex content-center items-center group'
                          size='xs'
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
                        >
                          <div className='absolute top-0 right-0 w-full h-full bg-black bg-opacity-80 rounded-full group-hover:scale-105' />
                          <CloseIcon
                            position='relative'
                            w={2}
                            h={2}
                            color='#fff'
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
