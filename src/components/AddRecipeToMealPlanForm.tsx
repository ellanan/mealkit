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
      <div className='flex flex-row items-center m-3 h-10 px-3 rounded-2xl shadow-addRecipeToMealPlanFormSearchbox'>
        <Search2Icon className='flex items-center justify-center h-4 w-4 mr-3 text-17' />
        <input
          className='outline-none'
          type='text'
          aria-label='Search for a recipe'
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
  const [addRecipeToMealPlanMutation, { error: errorAddingRecipeToMealPlan }] =
    useMutation<
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
      `
    );
  if (errorAddingRecipeToMealPlan) {
    throw errorAddingRecipeToMealPlan;
  }

  return (
    <Button
      className='flex flex-row justify-start bg-white p-4 w-full hover:bg-18 hover:text-19'
      size={'xs'}
      borderRadius='none'
      onClick={(e) => {
        e.preventDefault();

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
          update(cache, { data }) {
            cache.modify({
              id: cache.identify(mealPlan),
              fields: {
                schedule(existingEntriesInSchedule = []) {
                  return existingEntriesInSchedule.concat(
                    data?.addRecipeToMealPlan
                  );
                },
              },
            });
          },
          optimisticResponse: {
            addRecipeToMealPlan: {
              __typename: 'MealPlanEntry',
              id: `temp-id:${recipe.id}:${date}:${mealType}`,
              date,
              mealType,
              recipe,
            },
          },
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
