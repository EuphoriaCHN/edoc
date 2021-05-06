import RequestCore from './core';

export default function (method: string, bundling: boolean = false) {
    return async function (req: any = {}): ReturnType<typeof fetch> {
        try {
            const res = await RequestCore(method, req, bundling);

            return res.data;
        } catch (err) {
            return Promise.reject(err);
        }
    }
}