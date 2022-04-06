import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { Routes } from '../@types/navigation';

import NewsFeed from '../screens/news-feed';

const Stack = createNativeStackNavigator();

function noop() {
  return null;
}

function ItemScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>HII</Text>
    </View>
  );
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
