import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const $fetcher = axios.create({
  baseURL: 'https://newsapi.org/v2/',
  responseType: 'json',
  headers: {
    Authorization: '1cd3762d0a574abc96d2411e2fa1c646',
  },
});

$fetcher.interceptors.request.use(function success(request) {
  console.log('REQUEST', request.baseURL, request.url, request.headers);
  return request;
});

function getFetcher() {
  return $fetcher;
}

export default getFetcher;
