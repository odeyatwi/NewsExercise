export type NewsResponseItem = {
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content: string;
  source: {
    id: string;
    name: string;
  };
};

export type NewsResponse = {
  status: string;
  totalResults: number;
  articles: NewsResponseItem[];
};
