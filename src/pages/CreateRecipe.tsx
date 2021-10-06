import { useMutation, gql } from '@apollo/client';
import type * as GraphQLTypes from '../generated/graphql';

export const CreateRecipe = () => {
  const [createRecipe, { error }] = useMutation<
    GraphQLTypes.CreateRecipeMutation,
    GraphQLTypes.CreateRecipeMutationVariables
  >(gql`
    mutation CreateRecipe($name: String!) {
      createRecipe(name: $name) {
        id
        name
      }
    }
  `);

  if (error) {
    throw error;
  }

  return (
    <>
      <h1>create recipe page</h1>
      <button
        onClick={() => {
          createRecipe({
            variables: {
              name: 'add recipe button works',
            },
          });
        }}
      >
        create recipe
      </button>
    </>
  );
};
