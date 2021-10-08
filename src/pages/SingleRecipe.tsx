import { useQuery, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';

export const SingleRecipe = ({ recipeId }: { recipeId: string }) => {
  const { data, error } = useQuery<
    GraphQLTypes.SingleRecipeQuery,
    GraphQLTypes.SingleRecipeQueryVariables
  >(
    gql`
      query SingleRecipe($recipeId: ID!) {
        recipe(recipeId: $recipeId) {
          id
          name
        }
      }
    `,
    {
      variables: {
        recipeId,
      },
    }
  );
  if (error) {
    throw error;
  }

  return (
    <>
      <h1>{data?.recipe?.name}</h1>
    </>
  );
};
