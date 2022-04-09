import React, { useRef, useState } from 'react';
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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import produce from 'immer';

import { NewsResponse } from '~/@types/response';
import { NewsItems } from '~/@types/uiData';

import { truncate } from '../../utils';
import getFetcher from '../../network';
import { RootNavigationProps, Routes } from '../../@types/navigation';

const PAGE_SIZE = 100;

async function fetch({
  query,
  page,
  sources,
}: {
  query: string;
  page: number;
  sources?: string;
}) {
  let url = `everything?q=${query}&page=${page}`;
  if (sources != undefined) {
    url += `&sources=${sources}`;
  }
  const result = (await getFetcher().get<NewsResponse>(url)).data;
  return {
    total: result.totalResults,
    result: result.articles?.map<ItemProps>(
      ({ title, description, content, publishedAt, urlToImage, author }) => ({
        title,
        author,
        description,
        content,
        publishDate: new Date(publishedAt).toDateString(),
        image: urlToImage,
      })
    ),
  };
}

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
  const page = useRef(1);
  const client = useQueryClient();
  const [isRenderMore, setIsRenderMore] = useState(false);
  const key = ['News', query];
  if (sources != undefined) {
    key.push(sources);
  }
  const { data, isLoading, isError } = useQuery(
    key,
    async () => fetch({ query, page: page.current, sources }),
    { enabled: query != '' || sources != undefined }
  );

  const { mutate } = useMutation(fetch);

  const loadMore = () => {
    if ((data?.total || 0) > page.current * PAGE_SIZE) {
      page.current = page.current + 1;
      setIsRenderMore(true);
      mutate(
        { page: page.current, query, sources },
        {
          onSuccess: (result) => {
            setIsRenderMore(false);
            const cached = client.getQueryData<{
              total: Number;
              result: NewsItems;
            }>(key);
            if (cached) {
              const update = produce(cached, (draft) => {
                draft.result.push(...result.result);
              });
              client.setQueryData(key, update);
            }
          },
          onError: () => {
            setIsRenderMore(false);
          },
        }
      );
    }
  };

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
  return (
    <FlatList
      data={data?.result}
      renderItem={({ item }) => <Item {...item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={isRenderMore ? <ActivityIndicator /> : null}
    />
  );
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
