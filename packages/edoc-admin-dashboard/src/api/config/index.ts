import { useState, useEffect } from 'react';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from './globalConfig';
import { HTTP_STATUS_CODE, ERR_CODE } from '@/common/utils/constants';
import { isArray, each } from 'lodash-es';
import Cookie from 'js-cookie';

// 响应结构
export type ResponseData<T = any> = {
  success: boolean;
  data?: T;
  errorMsg?: string;
  errorCode?: string;
  total?: number;
};

// 错误响应结构
export interface ResponseError extends Exclude<AxiosError, 'config'> {
  config: AxiosRequestConfig & { _retryCount: number; };
}

// API 注册参数
export interface ApiOption extends AxiosRequestConfig {
  mock?: boolean; // 单 API 是否 mock
  mockService?: string; // 单 API mock 服务
}

// 额外请求配置
// todo:: 没想出来把 debounce 细化到每一次调用... 暂不支持
export type RequestExtraOption = {
  // 默认 debounce 时间在 config 中可以设置，兜底 200 ms
  // 也可以传入一个 number 指定这个 API 调用时是否 debounce
  // 或者是一个配置对象，immediate 可以控制是否在首次调用时立即触发
  debounce?: boolean | number | { delay: number; immediate?: boolean; };
};

// Hooks Config
export type ApiHooksConfig<T> = {
  manual?: boolean; // 如果为 true，则不立即调用
  init?: T; // 默认值，默认 undefined
  transform?: (value: T) => T;
};

export type UseHooksReturns<T = any, R = any> = (configs?: ApiHooksConfig<R>, _deps?: any[]) => HookRequest<T, R>;

export type HookRequest<T, R> = {
  data: { data: R, total: number | null };
  loading: boolean;
  error: Error | null;
  start: Signature<T, R>;
};

// 工厂方法
// 范型 T：请求参数结构
// 范型 R：响应数据结构
// 因为 Axios Response 最后会被【去壳】
// 所以这里应当返回的是 Promise<R>
export type Signature<T = any, R = any> = (param?: T, options?: RequestExtraOption) => Promise<{ data: R, total: number | null }>;

// 构造 Axios 实例
const instance = axios.create(config);

// Axios 请求捕获，针对 get 请求需要序列化 Array 类型的参数
instance.interceptors.request.use(value => {
  if (!!value.data) {
    value.data = {
      data: value.data
    }
  }

  if (value.method.toLowerCase() === 'get') {
    const newParams = {};

    const { params: old } = value;

    each(old, (val, key) => {
      newParams[key] = isArray(val) ? JSON.stringify(val) : val;
    });
  }

  const authorizationValue = Cookie.get(AUTHORIZATION_KEY);
  value.headers[AUTHORIZATION_KEY] = authorizationValue || null;

  return value;
}, (_: any) => { });

// 避免出现实际 API 方法的返回值是 AxiosPromise<R> 类型
// 这样会造成 API 方法没有被【去壳】
// 故将 instance.interceptors.response.use 的 Response 捕获抽离出来
const onAxiosInstanceFulfilled = async (value: AxiosResponse<ResponseData>) => {
  if (value.status !== HTTP_STATUS_CODE.SUCCESS) {
    // 不是 200
    return Promise.reject(value);
  }
  const { data, success, errorMsg, errorCode, total } = value.data;

  if (!!success) {
    return Promise.resolve({ data, total });
  }

  switch (errorCode) {
    case ERR_CODE.PERMISSION_DENIED:
    case ERR_CODE.IDENTITY_MATCH_FAIL:
      break;
  }

  return Promise.reject({ message: errorMsg, errorCode });
};

const onAxiosInstanceRejected = async (error: ResponseError) => {
  if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1) {
    // 超时重试
    const axiosConfig = error.config;

    axiosConfig._retryCount = axiosConfig._retryCount || 0;

    if (axiosConfig._retryCount >= config.retry) {
      return Promise.reject(error);
    }

    axiosConfig._retryCount += 1;

    const retryPromise = new Promise<void>(resolve => {
      setTimeout(() => resolve(), config.retryDelay || 1);
    });

    return retryPromise.then(() => instance(axiosConfig).then(onAxiosInstanceFulfilled, onAxiosInstanceRejected));
  } else {
    let message = error.response?.data?.message || error.message;
    message = typeof message === 'string' ? message : JSON.stringify(message);
    const data = error.response?.data || {};
    return Promise.reject({ message, data });
  }
};

// 注册函数默认参数
const SIGN_OPTION_DEFAULT: AxiosRequestConfig = {
  method: 'GET', // 默认请求方式为 GET
  url: '/',
  data: {},
  params: {}
};

// URL 前缀 / 规范格式化
const formatURLPrefix = (url: string): string => {
  if (url && typeof url === 'string' && url.length) {
    if (url[0] === '/') {
      return url;
    }
    return '/'.concat(url);
  }
  return '/';
};

export abstract class API {
  protected static MOCK_ALL: boolean;
  protected static MOCK_ENV: string;
  protected static PREFIX: string;
  protected static DEFAULT_OPTIONS: Partial<AxiosRequestConfig>;

  // [k: string]: string | boolean | Signature | UseHooksReturns;

  private static _useHooks<Request, Response>(
    _fetch: Signature<Request, Response>
  ): UseHooksReturns<Request, Response> {
    return function (configs = {}, _deps = []) {
      const { init = undefined, manual = false, transform = _ => _ } = configs;
      const deps = Array.isArray(_deps) ? _deps : [];

      const [data, setData] = useState<Response>(init);
      const [loading, setLoading] = useState<boolean>(false);
      const [error, setError] = useState<Error>(null);

      let cancel = false;

      const start: typeof _fetch = async params => {
        setLoading(true);

        let res;

        try {
          res = await _fetch(params);
          !cancel && setData(transform(res));
        } catch (error) {
          !cancel && setError(error);
          return Promise.reject(error);
        } finally {
          setLoading(false);
        }

        return Promise.resolve(res);
      };

      useEffect(() => {
        !manual && start();
        return () => {
          cancel = true
        }
      }, deps);

      return { data: { data: data?.data, total: data?.total }, loading, error, start };
    }
  }

  // Override
  public static sign<T = any, R = any>(options: Partial<ApiOption> & { useHooks: boolean; }): UseHooksReturns<T, R>;
  public static sign<T = any, R = any>(options: Partial<ApiOption> & { static: boolean; }): string;
  public static sign<T = any, R = any>(options: Partial<ApiOption>): Signature<T, R>;

  public static sign<T = any, R = any>(
    options: Partial<ApiOption & { useHooks: boolean; static: boolean; }>
  ): UseHooksReturns<T, R> | Signature<T, R> | string {
    const { MOCK_ALL = false, MOCK_ENV, PREFIX = '', DEFAULT_OPTIONS } = this;

    const requestOption = Object.assign({}, SIGN_OPTION_DEFAULT, DEFAULT_OPTIONS, options);

    // 捏造前缀
    requestOption.url = PREFIX.concat(formatURLPrefix(requestOption.url));

    // 捏造 请求完整路径
    let mockFlag;

    // 判断这个请求是否需要 MOCK & mock service 地址
    // 权重如下：
    // API 内部设置 > API 类静态设置 > Global
    // undefined: 向上寻找父级设置，如果 Global 还是 undefined 则为 false
    // false: 显示声明，不取 MOCK
    // true: 显示声明，需要 MOCK

    // 搜寻 API 内部是否设置
    if (options.mock !== undefined && mockFlag === undefined) {
      mockFlag = options.mock;
    }

    // 向上搜寻类静态配置
    if (MOCK_ALL !== undefined && mockFlag === undefined) {
      mockFlag = MOCK_ALL;
    }

    // 搜寻全局配置
    if (config.mockAll === true) {
      mockFlag = true;
    } else if (mockFlag === undefined) {
      // 兜底
      mockFlag = false;
    }

    // 确定请求路径
    // 是否 MOCK
    if (mockFlag) {
      let baseUrl: string | undefined;

      // 搜寻 API 内部是否设置
      if (!baseUrl && options.mockService && options.mockService.length) {
        baseUrl = options.mockService;
        requestOption.url = baseUrl.concat(requestOption.url);
      }

      // 向上搜寻类静态配置
      if (!baseUrl && MOCK_ENV && MOCK_ENV.length) {
        baseUrl = MOCK_ENV;
        requestOption.url = baseUrl.concat(requestOption.url);
      }

      // 搜寻全局配置
      if (!baseUrl && config.mockService && config.mockService.length) {
        baseUrl = config.mockService;
        requestOption.url = baseUrl.concat(requestOption.url);
      } else if (!baseUrl) {
        // 兜底拼接 base URL 并警告
        const _ = config.baseURL.concat(requestOption.url);

        console.warn(`Can not find mock Service of ${requestOption.url} but we got U need mock it, we will let this request URL like ${_}`);
        requestOption.url = _;
      }
    } else {
      // 直接拼接 base URL
      requestOption.url = config.baseURL.concat(requestOption.url);
    }

    if (!!options.static) {
      return requestOption.url;
    }

    /**
     * API Instance Method
     */
    const request: Signature<T, R> = async function (params) {
      // 参数格式化
      switch (requestOption.method.toLowerCase()) {
        case 'post':
          requestOption.data = params;
          break;
        case 'get':
        case 'delete':
        case 'put':
          requestOption.params = params;
          break;
      }

      return instance(requestOption).then(onAxiosInstanceFulfilled, onAxiosInstanceRejected);
    };

    if (typeof options.useHooks === 'boolean' && options.useHooks) {
      return API._useHooks(request);
    } else {
      return request;
    }
  }
}

export default API;
