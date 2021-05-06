import axios from 'axios';

const prefix = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:9091/mock/14';

export default async function requestCore<T extends any = any>(key: string, req: any, bundling: boolean = false): Promise<T> {
    return axios.request({
        url: `${prefix}/${key}`,
        params: req,
        method: 'GET',
        headers: {
            'X-Require-Node': 'true',
            'Content-Type': 'application/json'
        },
        withCredentials: false,
    }).then(res => {
        if (res.status !== 200) {
            throw res;
        }
        return res.data;
    }, err => { throw err });
}