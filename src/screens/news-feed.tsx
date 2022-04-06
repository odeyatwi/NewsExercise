import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  ActivityIndicator,
  Chip,
  DefaultTheme,
  Searchbar,
  Text,
} from 'react-native-paper';
import { isError, useQuery } from 'react-query';

import { NewsResponse } from '~/@types/response';
import getFetcher from '../network';

const CATEGORIES = [
  'business',
  'entertainment',
  'general',
  'health',
  'science',
  'sports',
  'technology',
] as const;

function NewsFeed() {
  const [query, setQuery] = useState('');
  const [category, setSelectedCategory] = useState<
    typeof CATEGORIES[number] | undefined
  >();
  const queryKey = query + (category != undefined ? category : '');
  const { data, isLoading, isError } = useQuery(queryKey, async () => {
    return await (
      await getFetcher().get<NewsResponse>(
        `sources?language=en&q=${query}` +
          (category != undefined ? `&category=${category}` : '')
      )
    ).data;
  });

  const renderError = () => {
    return <View></View>;
  };

  const renderLoading = () => {
    return <ActivityIndicator />;
  };

  const renderData = () => {
    return (
      <FlatList
        data={data?.sources}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <Searchbar placeholder="Search" onChangeText={setQuery} value={query} />
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          margin: 10,
        }}
      >
        {CATEGORIES.map((item) => (
          <Chip
            selected={item === category}
            style={{ margin: 5 }}
            mode="outlined"
            onPress={() => setSelectedCategory(item)}
            selectedColor={DefaultTheme.colors.primary}
          >
            {item}
          </Chip>
        ))}
      </View>
      <Text>{`code: ${data?.status}, result:${data?.sources.length}`}</Text>
      {isLoading && renderLoading()}
      {isError && renderError()}
      {data != undefined && renderData()}
    </View>
  );
}

export default NewsFeed;
