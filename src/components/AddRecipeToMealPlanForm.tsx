/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useQuery, useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';
import { Button } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { MutableRefObject, useState } from 'react';

export const AddRecipeToMealPlanForm = ({
  mealPlanId,
  date,
  mealType,
  autoFocusRef,
}: {
  mealPlanId: string;
  date: string;
  mealType: GraphQLTypes.MealType;
  autoFocusRef: MutableRefObject<any>;
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
    <div
      css={css`
        margin: 0.8em;
      `}
    >
      <div
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          border: 0.5px solid #ebb59c;
          border-radius: 20px;
          height: 2.4em;
          padding: 16px;
          width: 80%;
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
      {recipesData?.recipes
        .filter((recipe) =>
          recipe.name.toLowerCase().includes(searchRecipe.toLowerCase())
        )
        .map((recipe) => (
          <div key={recipe.name}>
            <h3>{recipe.name}</h3>
            <Button
              size={'xs'}
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
            </Button>
          </div>
        ))}
    </div>
  );
};
