import React, { useState } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Card,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';

import { NewsResponse } from '~/@types/response';

import { truncate } from '../../utils';
import getFetcher from '../../network';
import { RootNavigationProps, Routes } from '../../@types/navigation';

interface ItemProps {
  title: string;
  author: string | null;
  publishDate: string;
  description: string;
  image: string | null;
  content: string;
}

function Item(item: ItemProps) {
  const navigation = useNavigation<RootNavigationProps>();
  const { title, publishDate, image, description } = item;
  const [imageError, setImageError] = useState(image == null);
  return (
    <Card
      key={title}
      style={styles.item}
      onPress={() => navigation.navigate(Routes.NEWS_ITEM, item)}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {image != null && !imageError ? (
          <Avatar.Image
            source={{ uri: image }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Avatar.Icon icon={'image'} />
        )}
        <View style={{ marginStart: 8, flex: 1 }}>
          <Title>{title}</Title>
          <Text>{publishDate}</Text>
          <Text>{truncate(description, 80)}</Text>
        </View>
      </View>
    </Card>
  );
}

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
  const { data, isLoading, isError } = useQuery(
    key,
    async () => {
      let url = `everything?q=${query}`;
      if (sources != undefined) {
        url += `&sources=${sources}`;
      }
      const result = (await getFetcher().get<NewsResponse>(url)).data;
      return result.articles?.map<ItemProps>(
        ({ title, description, content, publishedAt, urlToImage, author }) => ({
          title,
          author,
          description,
          content,
          publishDate: new Date(publishedAt).toDateString(),
          image: urlToImage,
        })
      );
    },
    { enabled: query != '' || sources != undefined }
  );

  if (isError || isLoading || (query === '' && sources == undefined)) {
    return (
      <View style={styles.fullScreenCenter}>
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
  return <FlatList data={data} renderItem={({ item }) => <Item {...item} />} />;
}

export default Result;

const styles = StyleSheet.create({
  fullScreenCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    elevation: 4,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    margin: 10,
  },
});
