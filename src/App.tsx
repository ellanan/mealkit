import { ApolloProvider, useQuery, gql } from '@apollo/client';
import { apolloClient } from './apolloClient';
import type * as GraphQLTypes from './generated/graphql';

const Recipes = () => {
  const { data, loading, error } = useQuery<GraphQLTypes.RecipesQuery>(gql`
    query Recipes {
      ingredientTypes {
        id
        name
      }
      ingredients {
        id
        name
        type {
          id
          name
        }
      }
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
  if (error) {
    throw error;
  }
  return (
    <>
      {data?.recipes?.map((recipe) => (
        <div key={recipe?.id}>
          <h2>{recipe?.name}</h2>
          ingredients:{' '}
          <ul>
            {recipe?.ingredients?.map((ingredient) => (
              <li>{ingredient?.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
};

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div>
        <h1>meal planner</h1>
        <Recipes />
      </div>
    </ApolloProvider>
  );
}

export default App;
