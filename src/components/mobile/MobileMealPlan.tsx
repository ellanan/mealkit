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

import { MobileMealPlanSubNavbar } from "./MobileMealPlanSubNavbar";
import * as GraphQLTypes from "../../generated/graphql";
import { AddRecipeToMealPlanForm } from "../mealPlan/AddRecipeToMealPlanForm";

import defaultImg from "../../images/defaultImg.jpg";

export const MobileMealPlan = () => {
  const initRef = useRef<HTMLInputElement>(null);

  const today = useMemo(() => DateTime.now(), []);
  const [startDate, setStartDate] = useState<DateTime>(today.startOf("day"));
  const endDate = useMemo(() => startDate.plus({ days: 7 }), [startDate]);

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
    GraphQLTypes.MealScheduleMobileQuery,
    GraphQLTypes.MealScheduleMobileQueryVariables
  >(
    gql`
      query MealScheduleMobile($startDate: String!, $endDate: String!) {
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
    <>
      <MobileMealPlanSubNavbar
        today={today}
        interval={interval}
        startDate={startDate}
        setStartDate={setStartDate}
      />

      <div
        className="flex flex-col items-center flex-shrink flex-grow pt-24 pb-16"
        css={css`
          scrollbar-width: thin;
          scrollbar-color: #e7a47a60 transparent;
          ::-webkit-scrollbar {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            border-bottom: 4px solid #fff2ec;
            border-left: 4px solid #fff2ec;
            border-right: 4px solid #fff2ec;
            border-top: 4px solid #fff2ec;
            border-radius: 8px;
            background: #e7a47a60;
            min-height: 40 px;
          }
        `}
      >
        {interval.map((day) => {
          return (
            <div
              key={day.toISO()}
              className="flex flex-col items-center justify-center max-w-min"
            >
              <div className="text-14">
                <span className="flex items-center justify-center p-2 text-sm font-medium">
                  {`${day.weekdayLong.toUpperCase()}, ${day.monthLong
                    .slice(0, 3)
                    .toUpperCase()} ${day.day}`}
                </span>

                <div className="flex flex-row items-start justify-center min-h-[90px]">
                  {[
                    GraphQLTypes.MealType.Breakfast,
                    GraphQLTypes.MealType.Lunch,
                    GraphQLTypes.MealType.Dinner,
                  ].map((mealType) => {
                    const mealPlanEntries = mealPlan?.schedule.filter(
                      (entry) => {
                        return (
                          entry.mealType === mealType &&
                          entry.date &&
                          day.toISODate() ===
                            DateTime.fromISO(entry.date, {
                              setZone: true,
                            }).toISODate()
                        );
                      },
                    );
                    return (
                      <div key={mealType} className="px-2">
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
                                  className="group focus:shadow-none w-24"
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
                                  <AddIcon className="ml-1" w={2} h={2} />
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
                          <div key={entry.id} className="relative my-4 w-full">
                            <NavLink
                              className="block shadow-sm hover:shadow-md overflow-hidden rounded-xl"
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

                              <div className="text-14 text-center text-xs pb-1">
                                {entry.recipe.name}
                              </div>

                              <Button
                                className="absolute top-0 right-0 flex content-center items-center pl-0.5 pb-0.5"
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
                                                readField(
                                                  "id",
                                                  existingEntry,
                                                ) !== entry.id,
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
                                  className="absolute top-0 right-0 w-full h-full bg-black bg-opacity-20 rounded-tr-xl"
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
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
