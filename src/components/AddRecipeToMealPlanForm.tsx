/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { MutableRefObject, useState } from 'react';

export const AddRecipeToMealPlanForm = ({
  mealPlan,
  date,
  mealType,
  autoFocusRef,
  onComplete,
}: {
  mealPlan: Pick<GraphQLTypes.MealPlan, 'id' | '__typename'>;
  date: string;
  mealType: GraphQLTypes.MealType;
  autoFocusRef: MutableRefObject<any>;
  onComplete: () => void;
}) => {
  const [searchRecipe, setSearchRecipe] = useState<String>('');

  const { data: recipesData, error: errorLoadingRecipes } =
    useQuery<GraphQLTypes.RecipesQuery>(gql`
      query RecipesAvailable {
        recipes {
          id
          name
          imageUrl
          category {
            id
            name
          }
        }
      }
    `);
  if (errorLoadingRecipes) {
    throw errorLoadingRecipes;
  }

  return (
    <div>
      <div
        css={css`
          margin: 0.8em;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-radius: 20px;
          box-shadow: 0 0 4px 1px rgba(235, 181, 156, 0.3);
          height: 2.4em;
          padding: 16px;
          margin-bottom: 16px;
        `}
      >
        <label htmlFor='name'>
          <Search2Icon
            css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              height: 15px;
              width: 15px;
              margin-right: 0.5em;
              color: #ebb59c;
            `}
          />
        </label>
        <input
          type='text'
          placeholder='search recipe'
          size={20}
          css={css`
            outline: none;
          `}
          onChange={(e) => {
            e.preventDefault();
            setSearchRecipe(e.target.value);
          }}
          ref={autoFocusRef}
        />
      </div>

      <div
        css={css`
          margin-bottom: 0.8em;
        `}
      >
        {recipesData?.recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(searchRecipe.toLowerCase())
          )
          .map((recipe) => (
            <RecipeOption
              key={recipe.id}
              recipe={recipe}
              mealPlan={mealPlan}
              date={date}
              mealType={mealType}
              onComplete={onComplete}
            />
          ))}
      </div>
    </div>
  );
};

const RecipeOption = ({
  recipe,
  mealPlan,
  date,
  mealType,
  onComplete,
}: {
  recipe: GraphQLTypes.RecipesQuery['recipes'][number];
  mealPlan: Pick<GraphQLTypes.MealPlan, 'id' | '__typename'>;
  date: string;
  mealType: GraphQLTypes.MealType;
  onComplete: () => void;
}) => {
  const [
    addRecipeToMealPlanMutation,
    { error: errorAddingRecipeToMealPlan, client: apolloClient },
  ] = useMutation<
    GraphQLTypes.AddRecipeToMealPlanMutationMutation,
    GraphQLTypes.AddRecipeToMealPlanMutationMutationVariables
  >(
    gql`
      mutation AddRecipeToMealPlanMutation(
        $mealPlanId: ID!
        $recipeId: ID!
        $date: String!
        $mealType: MealType!
      ) {
        addRecipeToMealPlan(
          mealPlanId: $mealPlanId
          recipeId: $recipeId
          date: $date
          mealType: $mealType
        ) {
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
    `,
    {
      onCompleted(response) {
        const cache = apolloClient.cache;
        cache.modify({
          id: cache.identify(mealPlan),
          fields: {
            schedule(existingEntriesInSchedule) {
              return existingEntriesInSchedule.concat(
                response.addRecipeToMealPlan
              );
            },
          },
        });
      },
    }
  );
  if (errorAddingRecipeToMealPlan) {
    throw errorAddingRecipeToMealPlan;
  }

  const cache = apolloClient.cache;

  return (
    <Button
      size={'xs'}
      borderRadius='none'
      css={css`
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        background-color: #fff;
        padding: 18px;

        :hover {
          background-color: #ffd8ca;

          color: #333;
        }
      `}
      onClick={(e) => {
        e.preventDefault();
        const tempNewEntryId = `temp-id:${recipe.id}:${date}:${mealType}`;
        // update cache to add a temporary placeholder entry with an id we keep track of
        cache.modify({
          id: cache.identify(mealPlan),
          fields: {
            schedule(existingEntriesInSchedule: any, { readField }) {
              // references https://www.apollographql.com/docs/react/caching/cache-interaction/#using-cachemodify
              if (
                existingEntriesInSchedule.some(
                  (ref: any) => readField('id', ref) === tempNewEntryId
                )
              ) {
                return existingEntriesInSchedule;
              }

              return existingEntriesInSchedule.concat({
                __typename: 'MealPlanEntry',
                id: tempNewEntryId,
                date,
                mealType,
                recipe,
              });
            },
          },
        });
        // optimistically call oncomplete
        // TODO: handle when mutation fails
        onComplete();
        addRecipeToMealPlanMutation({
          variables: {
            mealPlanId: mealPlan.id,
            recipeId: recipe.id,
            date,
            mealType,
          },
        }).then(() => {
          // clean up the placeholder in cache to avoid duplicate entries
          cache.modify({
            id: cache.identify(mealPlan),
            fields: {
              schedule(existingEntriesInSchedule: any, { readField }) {
                return existingEntriesInSchedule.filter(
                  (existingEntry: any) =>
                    readField('id', existingEntry) !== tempNewEntryId
                );
              },
            },
          });
        });
      }}
    >
      {recipe.imageUrl ? (
        <img
          src={recipe.imageUrl}
          alt={`${recipe.name}`}
          css={css`
            border-radius: 10px;
            width: 24px;
            height: 24px;
          `}
        />
      ) : (
        <div
          css={css`
            border-radius: 10px;
            width: 24px;
            height: 24px;
            background-color: #f0f0f0;
          `}
        ></div>
      )}
      <span
        css={css`
          margin-left: 16px;
          font-size: 14px;
          font-weight: 400;
        `}
      >
        {recipe.name}
      </span>
    </Button>
  );
};
