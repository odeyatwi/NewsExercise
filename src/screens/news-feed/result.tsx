import React from 'react';
import { FlatList, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useQuery } from 'react-query';
import { NewsResponse } from '~/@types/response';
import getFetcher from '../../network';

interface IProps {
  sources?: string;
  query: string;
}

function Result({ query, sources }: IProps) {
  const theme = useTheme();
  const key = ['News', query];
  if (sources != undefined) {
    key.push(sources);
  }
  const { data, isLoading, isError } = useQuery(key, async () => {
    let url = `/everything?q=${query}`;
    if (sources != undefined) {
      url += `&sources=${sources}`;
    }
    return (await getFetcher().get<NewsResponse>(url)).data;
  });

  if (isError || isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: theme.colors.error }}>
            {query === '' && sources == undefined
              ? 'CHOOSE A CATEGORY OR SEARCH SOMETHING'
              : 'SOMETHING WENT WRONG'}
          </Text>
        )}
      </View>
    );
  }
  return (
    <FlatList
      data={data?.articles}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
  );
}

export default Result;
