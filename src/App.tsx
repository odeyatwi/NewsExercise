import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from 'react-query';
import { SafeAreaView } from 'react-native';

import Router from './router/router';
import getQueryClient from './cache';

const queryClient = getQueryClient();

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaView>
  );
}

export default App;
