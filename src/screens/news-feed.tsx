import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Chip, Searchbar, Text } from 'react-native-paper';
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
];

function NewsFeed() {
  const [query, setQuery] = useState('');
  const { data, isLoading, isError } = useQuery(query, async () => {
    return await (
      await getFetcher().get<NewsResponse>(`sources?language=en&q=${query}`)
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
        data={data?.articles}
        renderItem={({ item }) => <Text>{item.title}</Text>}
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
          <Chip style={{ margin: 5 }} mode="outlined">
            {item}
          </Chip>
        ))}
      </View>
      <Text>{`code: ${data?.status}, result:${data?.totalResults}`}</Text>
      {isLoading && renderLoading()}
      {isError && renderError()}
      {data != undefined && renderData()}
    </View>
  );
}

export default NewsFeed;
