import { QueryClient } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: Infinity,
      staleTime: Infinity,
      retry: 0,
    },
  },
});

function get(): QueryClient {
  return queryClient;
}

export default get;
