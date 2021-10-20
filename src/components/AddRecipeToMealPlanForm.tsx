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
    {
      loading: addingRecipe,
      error: errorAddingRecipeToMealPlan,
      client: apolloClient,
    },
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
        onComplete();
      },
    }
  );
  if (errorAddingRecipeToMealPlan) {
    throw errorAddingRecipeToMealPlan;
  }

  return (
    <div>
      <h3>{recipe.name}</h3>
      <Button
        size={'xs'}
        onClick={(e) => {
          e.preventDefault();
          addRecipeToMealPlanMutation({
            variables: {
              mealPlanId: mealPlan.id,
              recipeId: recipe.id,
              date,
              mealType,
            },
          });
        }}
      >
        {addingRecipe ? '...' : 'add to meal plan'}
      </Button>
    </div>
  );
};
