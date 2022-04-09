import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Routes } from '../@types/navigation';

import NewsFeed from '../screens/news-feed/news-feed';
import ItemScreen from '../screens/news-item/news-item';

const Stack = createNativeStackNavigator();

function noop() {
  return null;
}

function Router() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: noop,
        headerShown: false,
      }}
    >
      <Stack.Screen name={Routes.NEWS_FEED} component={NewsFeed} />
      <Stack.Screen name={Routes.NEWS_ITEM} component={ItemScreen} />
    </Stack.Navigator>
  );
}

export default Router;
