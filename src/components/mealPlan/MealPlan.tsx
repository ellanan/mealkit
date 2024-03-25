/** @jsxImportSource @emotion/react */
import { useMemo, useState, useRef } from "react";

import { useQuery, gql, useMutation } from "@apollo/client";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { DateTime, Interval } from "luxon";
import { NavLink } from "react-router-dom";

import { AddRecipeToMealPlanForm } from "./AddRecipeToMealPlanForm";
import { MealPlanDates } from "./MealPlanDates";
import { MealPlanTopBar } from "./MealPlanTopBar";
import * as GraphQLTypes from "../../generated/graphql";

import defaultImg from "../../images/defaultImg.jpg";

export const gqlMealPlanScheduleFragment = gql`
  fragment MealPlanScheduleFragment on MealPlanEntry {
    id
    date
    mealType
    recipe {
      id
      name
      imageUrl
    }
  }
`;

export const MealPlan = () => {
  const initRef = useRef<any>();

  const today = useMemo(() => DateTime.now(), []);
  const [startDate, setStartDate] = useState<DateTime>(today.startOf("week"));
  const endDate = useMemo(() => startDate.endOf("week"), [startDate]);

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
              ...MealPlanScheduleFragment
            }
          }
        }
      }
      ${gqlMealPlanScheduleFragment}
    `,
    {
      variables: {
        startDate: startDate.toISO(),
        endDate: endDate.toISO(),
      },
    },
  );
  if (error) {
    throw error;
  }

  const [deleteMealPlanEntryMutation, { error: errorDeletingMealPlanEntry }] =
    useMutation<
      GraphQLTypes.DeleteMealPlanEntryMutationMutation,
      GraphQLTypes.DeleteMealPlanEntryMutationMutationVariables
    >(gql`
      mutation DeleteMealPlanEntryMutation($mealPlanEntryId: ID!) {
        deleteMealPlanEntry(mealPlanEntryId: $mealPlanEntryId) {
          id
        }
      }
    `);
  if (errorDeletingMealPlanEntry) {
    throw errorDeletingMealPlanEntry;
  }
  const mealPlan = data?.currentUser?.mealPlan;

  return (
    <div className="ml-2 h-full flex flex-col">
      <MealPlanTopBar
        today={today}
        interval={interval}
        startDate={startDate}
        setStartDate={setStartDate}
      />

      <MealPlanDates today={today} interval={interval} />

      <div className="flex overflow-x-hidden overflow-y-scroll flex-shrink flex-grow mb-5">
        {interval.map((day) => {
          return (
            <div
              key={day.toISO()}
              className={[
                "flex-grow relative px-5 md:px-0 py-3 text-14 w-[calc(100%/7)]",
                "after:block after:w-[1px] after:h-full after:absolute after:top-0 after:right-0",
              ].join(" ")}
              css={css`
                &:not(:last-child):after {
                  content: "";
                  background-image: linear-gradient(
                    #fff0,
                    #f1e6e2 10%,
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
                      placement={"auto-start"}
                      isLazy={true}
                      autoFocus={true}
                      closeOnBlur={true}
                      initialFocusRef={initRef}
                    >
                      {({ onClose }) => (
                        <>
                          <PopoverTrigger>
                            <Button
                              className="group focus:shadow-none mx-2"
                              size="xs"
                              variant="unstyled"
                              aria-label={`add recipe to ${mealType}`}
                              onClick={() => {
                                setMealTypeAndDate({
                                  mealType,
                                  date: day.toISODate(),
                                });
                              }}
                            >
                              {mealType}
                              <AddIcon
                                className="opacity-0 group-hover:opacity-100 ml-1"
                                w={2}
                                h={2}
                              />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            width="100"
                            border="none"
                            shadow="lg"
                            borderRadius="20px"
                          >
                            {data?.currentUser?.mealPlan?.id &&
                              mealTypeAndDate?.date &&
                              mealTypeAndDate?.mealType && (
                                <AddRecipeToMealPlanForm
                                  mealPlan={data.currentUser.mealPlan}
                                  date={mealTypeAndDate.date}
                                  mealType={mealTypeAndDate.mealType}
                                  recipesToDisable={
                                    mealPlanEntries?.map(
                                      (entry) => entry.recipe,
                                    ) ?? []
                                  }
                                  autoFocusRef={initRef}
                                  onClose={onClose}
                                />
                              )}
                          </PopoverContent>
                        </>
                      )}
                    </Popover>

                    {mealPlanEntries?.map((entry) => (
                      <div
                        key={entry.id}
                        className="relative my-2 mx-4 mb-2"
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
                                rgba(0, 0, 0, 0.15) 40%,
                                rgba(0, 0, 0, 0.35)
                              );
                            }
                          }
                        `}
                      >
                        <NavLink
                          className="block shadow-sm hover:shadow-md overflow-hidden rounded-xl transition-all duration-150 hover:scale-105"
                          to={(location) => {
                            const newQueryParams = new URLSearchParams(
                              location.search,
                            );
                            newQueryParams.set(
                              "modalRecipeId",
                              entry.recipe.id,
                            );

                            return {
                              ...location,
                              search: newQueryParams.toString(),
                            };
                          }}
                        >
                          <div className="pt-[100%] relative overflow-hidden">
                            <img
                              className="absolute top-0 w-full h-full object-cover"
                              src={entry.recipe.imageUrl ?? defaultImg}
                              alt=""
                            />
                          </div>

                          <div className="text-14 text-center leading-tight text-xs mx-2 pb-1">
                            {entry.recipe.name}
                          </div>

                          <Button
                            className="deleteIndicator absolute top-[-1px] right-[-1px] flex content-center items-center"
                            css={css`
                              &:hover {
                                .closeIconBackdrop {
                                  transform: scale(1.25);
                                }
                              }
                            `}
                            size="xs"
                            variant="unstyled"
                            aria-label={`delete ${entry.recipe.name} from meal plan`}
                            disabled={!mealPlan}
                            onClick={(e) => {
                              e.preventDefault();
                              if (!mealPlan) return;
                              deleteMealPlanEntryMutation({
                                variables: {
                                  mealPlanEntryId: entry.id,
                                },
                                update(cache) {
                                  cache.modify({
                                    id: cache.identify(mealPlan),
                                    fields: {
                                      schedule(
                                        existingEntriesInSchedule,
                                        { readField },
                                      ) {
                                        return existingEntriesInSchedule.filter(
                                          (existingEntry: any) =>
                                            readField("id", existingEntry) !==
                                            entry.id,
                                        );
                                      },
                                    },
                                  });
                                },
                                optimisticResponse: {
                                  deleteMealPlanEntry: {
                                    __typename: "MealPlanEntry",
                                    id: entry.id,
                                  },
                                },
                              });
                            }}
                          >
                            <div
                              className="closeIconBackdrop absolute top-[1px] right-[1px] w-full h-full bg-black bg-opacity-20 rounded-tr-xl transition-all duration-100"
                              css={css`
                                border-bottom-left-radius: 22px;
                              `}
                            />
                            <CloseIcon
                              position="relative"
                              w={2}
                              h={2}
                              color="#fff"
                            />
                          </Button>
                        </NavLink>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
