import axios, { AxiosRequestConfig } from 'axios';
const domain =
  process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ||
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'stage'
    ? 'https://jsdude.com/api/user'
    : 'https://web.programming-hero.com/api/user';

const instance = axios.create({
  baseURL: domain,
});

instance.interceptors.request.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export const GET = async <T extends object = object>(
  url: string,
  config: AxiosRequestConfig = {}
) => {
  return instance.get<T>(url, config).then((res) => res.data);
};