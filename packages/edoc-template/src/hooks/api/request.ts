import RequestCore from './core';

import { Method } from 'axios';

export default function (url: string, method: Method = 'GET') {
    return async function (req: any = {}): ReturnType<typeof fetch> {
        try {
            const res = await RequestCore(url, req, method);

            return res.data;
        } catch (err) {
            return Promise.reject(err);
        }
    }
}