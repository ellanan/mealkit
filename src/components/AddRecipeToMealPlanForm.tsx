import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { useState } from 'react';

export const AddRecipeToMealPlanForm = ({
  mealPlanId,
  date,
  mealType,
}: {
  mealPlanId: string;
  date: string;
  mealType: GraphQLTypes.MealType;
}) => {
  const [searchRecipe, setSearchRecipe] = useState<String>('');

  const { data: recipesData, error: errorLoadingRecipes } =
    useQuery<GraphQLTypes.RecipesQuery>(gql`
      query RecipesAvailable {
        recipes {
          id
          name
          category {
            id
            name
          }
          ingredients {
            id
            name
          }
        }
      }
    `);
  if (errorLoadingRecipes) {
    throw errorLoadingRecipes;
  }

  const [addRecipeToMealPlanMutation, { error: errorAddingRecipeToMealPlan }] =
    useMutation<
      GraphQLTypes.AddRecipeToMealPlanMutationMutation,
      GraphQLTypes.AddRecipeToMealPlanMutationMutationVariables
    >(gql`
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
        }
      }
    `);
  if (errorAddingRecipeToMealPlan) {
    throw errorAddingRecipeToMealPlan;
  }

  return (
    <>
      <form>
        <label htmlFor='name'>search recipes</label>
        <input
          type='text'
          id='name'
          onChange={(e) => {
            e.preventDefault();
            setSearchRecipe(e.target.value);
          }}
        />
        {recipesData?.recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(searchRecipe.toLowerCase())
          )
          .map((recipe) => (
            <div key={recipe.name}>
              <h3>{recipe.name}</h3>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addRecipeToMealPlanMutation({
                    variables: {
                      mealPlanId: mealPlanId,
                      recipeId: recipe.id,
                      date: date,
                      mealType: mealType,
                    },
                  });
                }}
              >
                add to meal plan
              </button>
            </div>
          ))}
      </form>
    </>
  );
};
