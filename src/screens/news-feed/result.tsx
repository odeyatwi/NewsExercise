import React, { useState } from 'react';
import { FlatList, View, Image, StyleSheet } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Surface,
  Text,
  Title,
  useTheme,
} from 'react-native-paper';
import { useQuery } from 'react-query';
import { NewsResponse } from '~/@types/response';
import { truncate } from '../../utils';
import getFetcher from '../../network';

interface ItemProps {
  title: string;
  author: string | null;
  publishDate: string;
  description: string;
  image: string | null;
  content: string;
}

function Item(item: ItemProps) {
  const { title, publishDate, image, description } = item;
  const theme = useTheme();
  const [imageError, setImageError] = useState(image == null);
  return (
    <Surface style={styles.item}>
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
    </Surface>
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

  if (isError || isLoading) {
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
