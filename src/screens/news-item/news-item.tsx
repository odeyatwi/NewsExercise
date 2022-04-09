import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Image, StyleSheet, View } from 'react-native';
import { Appbar, Subheading, Text, Title } from 'react-native-paper';

import {
  RootNavigationProps,
  RootRouteProps,
  Routes,
} from '../../@types/navigation';

interface IProps {
  title: string;
  author: string | null;
  publishDate: string;
  description: string;
  image: string | null;
  content: string;
}

function NewsItem() {
  const { title, author, publishDate, description, image, content } =
    useRoute<RootRouteProps<Routes.NEWS_ITEM>>().params;
  const navigation = useNavigation<RootNavigationProps>();

  return (
    <View style={styles.fullScreen}>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
      </Appbar.Header>
      {image != null && (
        <Image
          style={{ width: '100%', height: undefined, aspectRatio: 1.5 }}
          source={{ uri: image }}
        />
      )}
      <View style={{ paddingHorizontal: 10 }}>
        <Title>{title}</Title>
        <Subheading>
          {author} - {publishDate}
        </Subheading>
        <Text>{description}</Text>
        <Text />
        <Text>{content}</Text>
      </View>
    </View>
  );
}

export default NewsItem;

const styles = StyleSheet.create({
  fullScreenCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
  },
});
