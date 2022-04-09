type Status = 'ok' | 'error';

export type SourceResponseItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
};

export type SourcesResponse = {
  status: Status;
  sources: SourceResponseItem[];
};

export type NewsResponseItem = {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
};

export type NewsResponse = {
  status: Status;
  totalResults: number;
  articles: NewsResponseItem[];
};
