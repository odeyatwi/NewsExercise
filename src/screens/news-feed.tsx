import React, { useState } from 'react';
import { View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { useQuery } from 'react-query';

function NewsFeed() {
  const [query, setQuery] = useState('');
  const { data, isLoading, error } = useQuery('KEY', () => {});
  return (
    <View style={{ flex: 1 }}>
      <Searchbar placeholder="Search" onChangeText={setQuery} value={query} />
    </View>
  );
}

export default NewsFeed;
