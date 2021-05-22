import { noop } from 'lodash-es';

import { Signature } from '@/api/config';

export function calculatePagination(current: number, pageSize: number) {
  return {
    limit: pageSize,
    offset: (current - 1) * pageSize
  };
}

export function isEmpty(value: string | undefined | null, cb?: Function): boolean {
  if (typeof value !== 'string') {
    typeof cb === 'function' && cb();
    return true;
  }
  if (!value) {
    typeof cb === 'function' && cb();
  }
  return !value;
}

/**
 * 支持异步的轮询
 * 
 * @param callback 回调函数，可以是 async function  
 * @param timeout delay 时间
 * @param immediately 是否立即执行
 * @returns 通过 clearInterval context 可以停止轮询
 */
export function asyncInterval(
  callback: (...args: any[]) => (Promise<unknown> | void), 
  timeout: number,
  immediately?: boolean
  ) {
  let stopped = false;

  async function process() {
    const cbReturned = callback();

    if (cbReturned instanceof Promise) {
      await cbReturned;
    }

    if (stopped) {
      return;
    }
    return setTimeout(process, timeout);
  }

  if (!!immediately) {
    process();
  } else {
    !stopped && setTimeout(process, timeout);
  }

  return {
    clearInterval() {
      stopped = true;
    }
  };
}

/**
 * 构造一个请求轮询
 * 
 * @param fetchFunc 请求方法
 * @param fetchFuncParams 请求参数，没有需要传 {}
 * @param onSuccess onSuccess，会将 fetchFunc 的 Response.data 传入
 * @param immediately 是否立即调用，默认 false
 * @param delay delay 时间，默认 5000 ms
 * @param onError 当 fetchFunc 错误时，默认 noop
 * @param onErrorDispatchValue 当 fetchFunc 错误，会默认给 onSuccess 传入这个值兜底，默认 0
 * @param transform success 响应数据的 transformer
 * @returns 通过 clearInterval context 可以停止轮询
 */
export function makeRequestInterval<T>(
  fetchFunc: Signature<{}, T>,
  fetchFuncParams: { [k: string]: any },
  onSuccess: (data: T) => void,
  immediately: boolean = false,
  delay: number = 5000,
  onError: (err: Error) => void = noop,
  onErrorDispatchValue: T = 0 as any,
  transform: (data: T) => T  = data => parseFloat((data as any / 100).toFixed(4)) as any,
) {
  return asyncInterval(async function() {
    try {
      const { data } = await fetchFunc(fetchFuncParams);
      onSuccess(transform(data));
    } catch (err) {
      !!onError && onError(err);
      if (onErrorDispatchValue !== undefined) {
        onSuccess(onErrorDispatchValue);
      }
    }
  }, delay, immediately);
}
