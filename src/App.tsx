import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from 'react-query';

import Router from './router/router';
import getQueryClient from './cache';

const queryClient = getQueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </QueryClientProvider>
  );
}

export default App;
