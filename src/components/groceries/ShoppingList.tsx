/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { DateRange } from "react-date-range";
import Creatable from "react-select/creatable";
import _ from "lodash";
import { useQuery, useMutation, gql } from "@apollo/client";
import * as GraphQLTypes from "../../generated/graphql";
import { DateTime } from "luxon";
import {
  Button,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverArrow,
  PopoverFooter,
  PopoverCloseButton,
  Editable,
  EditableInput,
  useEditableControls,
  useMediaQuery,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { HiOutlineTrash } from "react-icons/hi";
import { FiAlertTriangle } from "react-icons/fi";

// persists the state (startDate & endDate) to localStorage, syncs between tabs and/or browser windows
const useShoppingListPersistedState = () => {
  const [rawState, setRawState] = useLocalStorage<{
    startDate: string | null;
    endDate: string | null;
  }>("shopping list", {
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
        key: "shopping list range",
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

// ChakraUI: use custom controls to toggle the edit mode
const EditableControls = ({ text }: { text: string }) => {
  const { getEditButtonProps, isEditing } = useEditableControls();

  if (isEditing) return null;

  return (
    <button
      {...getEditButtonProps()}
      className="bg-transparent"
      css={css`
        &:hover {
          .edit-icon {
            opacity: 1;
            color: #ff9307;
          }
        }
      `}
    >
      {text}
      <EditIcon w="2.5" h="2.5" className="opacity-0 edit-icon" />
    </button>
  );
};

export const ShoppingList = () => {
  const [range, setRange] = useShoppingListPersistedState();

  const [isLargerThan850] = useMediaQuery("(min-width: 850px)");

  const {
    data,
    error: errorGeneratingShoppingList,
    loading: loadingShoppingList,
  } = useQuery<
    GraphQLTypes.ShoppingListQuery,
    GraphQLTypes.ShoppingListQueryVariables
  >(
    gql`
      query ShoppingList($startDate: String!, $endDate: String!) {
        currentUser {
          id
          mealPlan {
            id
            ingredientTypes {
              id
              name
            }
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
  if (errorGeneratingShoppingList) {
    throw errorGeneratingShoppingList;
  }

  const [createIngredientType, { error: errorCreatingIngredientType }] =
    useMutation<
      GraphQLTypes.CreateIngredientTypeMutation,
      GraphQLTypes.CreateIngredientTypeMutationVariables
    >(gql`
      mutation CreateIngredientType($name: String!, $ingredients: [ID!]) {
        createIngredientType(name: $name, ingredients: $ingredients) {
          id
          name
        }
      }
    `);
  if (errorCreatingIngredientType) {
    throw errorCreatingIngredientType;
  }

  const [updateIngredient, { error: errorUpdatingIngredient }] = useMutation<
    GraphQLTypes.UpdateIngredientMutation,
    GraphQLTypes.UpdateIngredientMutationVariables
  >(gql`
    mutation UpdateIngredient($ingredientId: ID!, $ingredientTypeId: ID!) {
      updateIngredient(
        ingredientId: $ingredientId
        ingredientTypeId: $ingredientTypeId
      ) {
        id
        name
        type {
          id
          name
        }
      }
    }
  `);
  if (errorUpdatingIngredient) {
    throw errorUpdatingIngredient;
  }

  const [editIngredientType, { error: errorEditingIngredientType }] =
    useMutation<
      GraphQLTypes.EditIngredientTypeMutation,
      GraphQLTypes.EditIngredientTypeMutationVariables
    >(gql`
      mutation EditIngredientType($ingredientTypeId: ID!, $name: String!) {
        editIngredientType(ingredientTypeId: $ingredientTypeId, name: $name) {
          id
          name
        }
      }
    `);
  if (errorEditingIngredientType) {
    throw errorEditingIngredientType;
  }

  const [deleteIngredientType, { error: errorDeletingIngredientType }] =
    useMutation<
      GraphQLTypes.DeleteIngredientTypeMutation,
      GraphQLTypes.DeleteIngredientTypeMutationVariables
    >(gql`
      mutation DeleteIngredientType($ingredientTypeId: ID!) {
        deleteIngredientType(ingredientTypeId: $ingredientTypeId) {
          id
        }
      }
    `);
  if (errorDeletingIngredientType) {
    throw errorDeletingIngredientType;
  }

  const ingredientQuantities = data?.currentUser?.mealPlan?.schedule
    .map((scheduledItem: any) => {
      return scheduledItem?.recipe?.ingredientQuantities ?? [];
    })
    .flat();

  return (
    <div
      className={
        isLargerThan850
          ? "flex flex-col flex-shrink flex-grow m-6 text-14"
          : "flex flex-col flex-shrink flex-grow h-full ml-6 pt-20 pr-4 text-14"
      }
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
          right: 0;
        }
      `}
    >
      <DateRange
        className="flex items-center -mt-6"
        css={css`
          .rdrNextPrevButton {
            background-color: transparent;
            color: #593e31;
          }
          .rdrMonthAndYearPickers {
            color: #593e31;
          }
        `}
        weekStartsOn={1}
        editableDateInputs={false}
        moveRangeOnFirstSelection={false}
        ranges={[range]}
        showMonthAndYearPickers={false}
        showDateDisplay={false}
        rangeColors={["#f7af90"]}
        onChange={(item) => {
          setRange(item[range.key]);
        }}
      />

      {loadingShoppingList ? (
        <div className="flex items-center justify-center italic text-base mt-4">
          <Spinner className="text-sm mr-2" color="orange" size="md" />
          loading groceries...
        </div>
      ) : null}

      {ingredientQuantities?.length === 0 && !loadingShoppingList ? (
        <span className="flex items-center justify-center mt-4">
          <FiAlertTriangle className="mr-2" color="orange" size="20" />
          No meals planned on the selected dates.
        </span>
      ) : (
        Object.values(
          _.groupBy(
            ingredientQuantities,
            (ingredientQuantity) => ingredientQuantity.ingredient.type?.name
          )
        ).map((ingredientQuantities) => (
          <div
            className={isLargerThan850 ? "last:pb-0" : "last:pb-16"}
            key={ingredientQuantities[0].ingredient.type?.id ?? "uncategorized"}
          >
            <div
              className={
                isLargerThan850
                  ? "group flex items-center justify-center font-normal text-sm relative bg-27 uppercase py-1"
                  : "group flex items-center justify-center font-normal text-sm relative bg-27 uppercase py-1"
              }
            >
              {!ingredientQuantities[0].ingredient.type?.name ? (
                "uncategorized"
              ) : (
                <Editable
                  defaultValue={ingredientQuantities[0].ingredient.type?.name.toUpperCase()}
                  isDisabled={
                    !ingredientQuantities[0].ingredient.type?.id ? true : false
                  }
                  isPreviewFocusable={false}
                  onSubmit={(newIngredientName) => {
                    editIngredientType({
                      variables: {
                        ingredientTypeId:
                          ingredientQuantities[0].ingredient.type?.id,
                        name: newIngredientName,
                      },

                      update: (cache) => {
                        cache.modify({
                          id: cache.identify({ __typename: "Query" }),
                          fields: {
                            ingredientTypes: (existingIngredientTypes) => {
                              return existingIngredientTypes.map(
                                (ingredientType: any) => {
                                  if (
                                    !ingredientQuantities[0].ingredient.type?.id
                                  ) {
                                    return { ...ingredientType };
                                  }
                                  if (
                                    ingredientType.id ===
                                    ingredientQuantities[0].ingredient.type?.id
                                  ) {
                                    return {
                                      ...ingredientType,
                                      name: newIngredientName.toUpperCase(),
                                    };
                                  }
                                  return ingredientType;
                                }
                              );
                            },
                          },
                        });
                      },

                      optimisticResponse: {
                        editIngredientType: {
                          __typename: "IngredientType",
                          id: ingredientQuantities[0].ingredient.type?.id,
                          name: newIngredientName.toUpperCase(),
                        },
                      },
                    });
                  }}
                >
                  <EditableInput />
                  <EditableControls
                    text={ingredientQuantities[0].ingredient.type?.name.toUpperCase()}
                  />
                </Editable>
              )}

              <Popover isLazy={true}>
                {({ onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Button
                        className="text-xs absolute right-0 opacity-0 disabled:opacity-0 disabled:bg-transparent group-hover:opacity-100 hover:bg-transparent hover:text-yellow-600 px-2"
                        variant="ghost"
                        isDisabled={
                          !ingredientQuantities[0].ingredient.type?.id
                            ? true
                            : false
                        }
                      >
                        <HiOutlineTrash className="w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent marginRight={2}>
                      <PopoverHeader
                        fontWeight="semibold"
                        textTransform="initial"
                      >
                        Delete Ingredient Type
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody textTransform="initial">
                        Are you sure you want to permanently delete the
                        ingredient type?
                      </PopoverBody>
                      <PopoverFooter
                        border="0"
                        d="flex"
                        alignItems="center"
                        justifyContent="flex-end"
                        pt={3}
                        pb={3}
                      >
                        <Button className="text-xs" size="sm" onClick={onClose}>
                          Cancel
                        </Button>
                        <Button
                          className="text-xs"
                          colorScheme="red"
                          ml={3}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteIngredientType({
                              variables: {
                                ingredientTypeId:
                                  ingredientQuantities[0].ingredient.type?.id,
                              },
                              update: (cache) => {
                                if (!data?.currentUser?.mealPlan) return;
                                cache.modify({
                                  id: cache.identify(
                                    data?.currentUser?.mealPlan
                                  ),
                                  fields: {
                                    ingredientTypes: (
                                      ingredientTypes,
                                      { readField }
                                    ) => {
                                      return data?.currentUser?.mealPlan?.ingredientTypes.filter(
                                        (ingredientType: any) =>
                                          readField("id", ingredientType) !==
                                          ingredientQuantities[0].ingredient
                                            .type?.id
                                      );
                                    },
                                  },
                                });
                                ingredientQuantities.forEach(
                                  ({ ingredient }) => {
                                    cache.modify({
                                      id: cache.identify(ingredient),
                                      fields: {
                                        type() {
                                          return null;
                                        },
                                      },
                                    });
                                  }
                                );
                              },
                              optimisticResponse: {
                                deleteIngredientType: {
                                  __typename: "IngredientType",
                                  id: ingredientQuantities[0].ingredient.type
                                    ?.id,
                                },
                              },
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </>
                )}
              </Popover>
            </div>

            <ul className="mb-2 text-base list-disc">
              {Object.values(
                _.groupBy(
                  ingredientQuantities,
                  (ingredientQuantity) =>
                    ingredientQuantity.ingredient.id + ingredientQuantity.unit
                )
              ).map((ingredientQuantities) => {
                return (
                  <li
                    className="flex flex-row w-full group list-disc text-sm leading-loose px-1 font-Raleway"
                    key={
                      ingredientQuantities[0].ingredient.id +
                      ingredientQuantities[0].unit
                    }
                  >
                    <span>
                      <span className="capitalize">
                        {ingredientQuantities[0].ingredient.name}
                      </span>
                      <small>
                        <span className="ml-1">
                          {_.sumBy(ingredientQuantities, (x) => x.amount)}
                        </span>
                        <span className="ml-1">
                          {ingredientQuantities[0].unit}
                        </span>
                      </small>
                    </span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 focus-within:opacity-100 relative cursor-pointer">
                      <span className="uppercase text-xs">
                        set ingredient type
                      </span>
                      <Creatable
                        className="min-w-[150px] absolute top-0 right-0 leading-tight opacity-0 focus-within:opacity-100 "
                        styles={{
                          control: (base: any) => ({
                            ...base,
                            minHeight: "auto",
                            cursor: "pointer",
                          }),
                          indicatorSeparator: (base: any) => ({
                            display: "none",
                          }),
                          dropdownIndicator: (base: any) => ({
                            ...base,
                            padding: "0 4px",
                          }),
                        }}
                        options={data?.currentUser?.mealPlan?.ingredientTypes.map(
                          ({ id, name }) => ({
                            value: id,
                            label: name,
                            isDisabled:
                              id.startsWith("temp-id:") ||
                              id ===
                                ingredientQuantities[0].ingredient.type?.id,
                          })
                        )}
                        isSearchable={true}
                        isClearable={true}
                        placeholder="type"
                        menuPlacement="top"
                        onChange={async (newValue, actionMeta) => {
                          if (!newValue || !newValue.value) {
                            console.log(`no newValue`, actionMeta);
                            return;
                          }

                          let ingredientTypeId;

                          if (actionMeta.action === "create-option") {
                            const createIngredientTypeResult =
                              await createIngredientType({
                                variables: {
                                  name: newValue.value.toUpperCase(),
                                  ingredients: [
                                    ingredientQuantities[0].ingredient.id,
                                  ],
                                },
                                update(cache, response) {
                                  if (!data?.currentUser?.mealPlan) return;
                                  // update mealplan ingredientTypes to include new ingredientType
                                  cache.modify({
                                    id: cache.identify(
                                      data?.currentUser?.mealPlan
                                    ),
                                    fields: {
                                      ingredientTypes: (ingredientTypes) => {
                                        return ingredientTypes.concat(
                                          response.data?.createIngredientType
                                        );
                                      },
                                    },
                                  });

                                  // update this ingredient to reference new ingredientType
                                  cache.modify({
                                    id: cache.identify(
                                      ingredientQuantities[0].ingredient
                                    ),
                                    fields: {
                                      type(existingType, { toReference }) {
                                        return toReference({
                                          __typename: "IngredientType",
                                          id: response.data
                                            ?.createIngredientType?.id,
                                        });
                                      },
                                    },
                                  });
                                },
                                optimisticResponse: {
                                  createIngredientType: {
                                    __typename: "IngredientType",
                                    id: `temp-id:${newValue.value}`,
                                    name: newValue.value.toUpperCase(),
                                  },
                                },
                              });

                            if (
                              !createIngredientTypeResult.data
                                ?.createIngredientType
                            ) {
                              console.log(
                                "failed to create ingredient type",
                                createIngredientTypeResult
                              );
                              return;
                            }

                            ingredientTypeId =
                              createIngredientTypeResult.data
                                .createIngredientType.id;
                          } else {
                            ingredientTypeId = newValue.value;
                            await updateIngredient({
                              variables: {
                                ingredientId:
                                  ingredientQuantities[0].ingredient.id,
                                ingredientTypeId: ingredientTypeId,
                              },
                              update(cache, { data }) {
                                cache.modify({
                                  id: cache.identify(
                                    ingredientQuantities[0].ingredient
                                  ),
                                  fields: {
                                    type(existingType, { toReference }) {
                                      return toReference({
                                        __typename: "IngredientType",
                                        id: data?.updateIngredient?.type?.id,
                                      });
                                    },
                                  },
                                });
                              },
                              optimisticResponse: {
                                updateIngredient: {
                                  __typename: "Ingredient",
                                  id: ingredientQuantities[0].ingredient.id,
                                  name: ingredientQuantities[0].ingredient.name,
                                  type: {
                                    id: newValue.value,
                                    name: newValue.label,
                                  },
                                },
                              },
                            });
                          }
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};
