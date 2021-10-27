import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { MutableRefObject, useState } from 'react';

const defaultImg = require('../images/defaultImg.jpg').default;

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
      <div className='flex flex-row items-center m-3 h-10 p-4 rounded-2xl addRecipeToMealPlanFormBoxShadow'>
        <label htmlFor='name'>
          <Search2Icon className='flex items-center justify-center h-4 w-4 mr-2 text-17' />
        </label>
        <input
          className='outline-none'
          type='text'
          placeholder='search recipe'
          size={20}
          onChange={(e) => {
            e.preventDefault();
            setSearchRecipe(e.target.value);
          }}
          ref={autoFocusRef}
        />
      </div>

      <div className='mb-3'>
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
      className='flex flex-row justify-start bg-white p-4 w-full hover:bg-18 hover:text-19'
      size={'xs'}
      borderRadius='none'
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
      <img
        className='w-6 h-6 rounded-xl object-cover'
        src={recipe.imageUrl ?? defaultImg}
        alt={`${recipe.name}`}
      />
      <span className='ml-4 text-sm font-normal'>{recipe.name}</span>
    </Button>
  );
};
