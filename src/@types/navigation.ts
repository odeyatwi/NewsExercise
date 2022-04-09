import { NavigationProp, Route } from '@react-navigation/native';

export enum Routes {
  NEWS_FEED = 'NEWS_FEED',
  NEWS_ITEM = 'NEWS_ITEM',
}

type RootNavigation = {
  [Routes.NEWS_FEED]: undefined;
  [Routes.NEWS_ITEM]: {
    title: string;
    author: string | null;
    publishDate: string;
    description: string;
    image: string | null;
    content: string;
  };
};

export type RootNavigationProps = NavigationProp<RootNavigation>;
export type RootRouteProps<T extends keyof RootNavigation> = Route<
  T,
  RootNavigation[T]
>;
