export type NewsResponseItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  language: string;
  country: string;
};

export type NewsResponse = {
  status: string;
  sources: NewsResponseItem[];
};
