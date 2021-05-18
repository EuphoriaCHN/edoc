import axios, { Method, AxiosRequestConfig } from 'axios';

// const prefix = 'http://localhost:9091/mock/14';
const prefix = process.env.NODE_ENV === 'development' ? 'http://192.168.28.24:21002' : 'http://abs.bhj-noshampoo.site';

export default async function requestCore<T extends any = any>(key: string, req: any, method: Method = 'GET'): Promise<T> {
    const requestParams: AxiosRequestConfig = {};

    if (method.toLowerCase() === 'post') {
        requestParams.data = req;
    } else {
        requestParams.params = req;
    }

    return axios.request(Object.assign({
        url: `${prefix}/${key}`,
        method: method,
        headers: {
            'X-Require-Node': 'true',
            'Content-Type': 'application/json',
            'Edcs_482qr53fc': 'EgvF9E!2%NtIr5wmjL7Y@WFn@YrvvRa5v&j'
        },
        withCredentials: false,
    }, requestParams)).then(res => {
        if (res.status !== 200) {
            throw res;
        }
        return res.data;
    }, err => { throw err });
}