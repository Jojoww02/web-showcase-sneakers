import { AxiosError, type AxiosProgressEvent, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import apiConfig from '@/config/api';

export type RequestConfig<TVariables = unknown> = InternalAxiosRequestConfig;
export type ResponseConfig<TData = unknown> = AxiosResponse<TData>;

type ExtendedRequestConfig<TVariables> = RequestConfig<TVariables> & {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

export const axiosClient = async <
  TData,
  TError = unknown,
  TVariables = unknown,
>(
  config: ExtendedRequestConfig<TVariables>,
): Promise<ResponseConfig<TData>> => {
  const RAW_BASE = (import.meta as any).env?.AUTH_API_URL ?? (import.meta as any).env?.VITE_AUTH_API_URL;
  const BASE_API = String(RAW_BASE ?? 'http://localhost:5295').replace(/\/$/, '');
  return apiConfig
    .request<TVariables, ResponseConfig<TData>>({
      ...config,
      baseURL: BASE_API,
      onUploadProgress: config.onUploadProgress,
    })
    .catch((e: AxiosError<TError>) => {
      throw e;
    });
};

export default axiosClient;