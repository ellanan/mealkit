import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';

import { Recipes } from './components/Recipes';
import { CreateRecipe } from './components/CreateRecipe';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div>
        <h1>meal planner</h1>
        <CreateRecipe />
        <Recipes />
      </div>
    </ApolloProvider>
  );
}

export default App;
