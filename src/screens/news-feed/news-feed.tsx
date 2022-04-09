import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
      return result?.data?.sources
        .map((item) => item.id)
        .slice(0, 20)
        .join(',');
    },
    { enabled: category != null }
  );

  const renderError = () => {
    return (
      <View style={styles.fullScreenCenter}>
        <Text>SOMETHING WENT WRONG</Text>
      </View>
    );
  };

  const renderLoading = () => {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator />
      </View>
    );
  };

  const renderData = () => {
    return <Result query={query} sources={data} />;
  };

  return (
    <View style={{ flex: 1 }}>
      <Searchbar placeholder="Search" onChangeText={setQuery} value={query} />
      <View style={styles.mainContainer}>
        {CATEGORIES.map((item) => (
          <Chip
            selected={item === category}
            style={styles.chip}
            mode="outlined"
            onPress={() => setSelectedCategory(item)}
            selectedColor={DefaultTheme.colors.primary}
          >
            {item}
          </Chip>
        ))}
        <Chip
          style={styles.chip}
          onPress={() => setSelectedCategory(undefined)}
        >
          CLEAR
        </Chip>
      </View>
      {isLoading && renderLoading()}
      {isError && renderError()}
      {(data != undefined || category == null) && renderData()}
    </View>
  );
}

export default NewsFeed;

const styles = StyleSheet.create({
  fullScreenCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    margin: 10,
  },
  chip: { margin: 5 },
});
