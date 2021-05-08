/**
 * 请求配置文件
 */
import { AxiosRequestConfig } from 'axios';

export interface SignOptionDefault extends AxiosRequestConfig {
  retry?: number;
  retryDelay?: number;
  mockService?: string;
  mockAll?: boolean;
}

const config: SignOptionDefault = {
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://192.168.28.24:21002',
  timeout: 30 * 1000,
  withCredentials: false,
  retry: 1, // 重试 3 次
  retryDelay: 2000, // 重请求延迟

  mockService: 'http://localhost:9091/mock/12', // MOCK URL
  mockAll: false, // 所有请求全部打到 MOCK 服务
};

export default config;
