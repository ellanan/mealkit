import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './apolloClient';

import { MainHeader } from './components/MainHeader';
import { Recipes } from './components/Recipes';
import { Footer } from './components/Footer';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div>
        <MainHeader />
        <Recipes />
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
