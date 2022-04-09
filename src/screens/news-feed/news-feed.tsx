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

import { SourcesResponse } from '~/@types/response';
import getFetcher from '../../network';
import Result from './result';

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
  const { data, isLoading, isError } = useQuery(
    queryKey,
    async () => {
      const result = await getFetcher().get<SourcesResponse>(
        `sources?category=${category}`
      );
      console.log(
        'parse................',
        result?.data?.sources.map((item) => item.id)
      );
      return result?.data?.sources.map((item) => item.id).join(',');
    },
    { enabled: category != null }
  );

  if (isError || isLoading) {
    return (
      <View style={{ flex: 1 }}>
        {isLoading ? <ActivityIndicator /> : <Text>SOMETHING WENT WRONG</Text>}
      </View>
    );
  }

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
        <Chip onPress={() => setSelectedCategory(undefined)}>CLEAR</Chip>
      </View>
      <Result {...{ query, sources: data }} />
    </View>
  );
}

export default NewsFeed;
