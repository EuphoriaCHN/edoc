import { useEffect, useState } from 'react';

export interface UseRequestConfig {
    initialData?: any;
    manual?: boolean;
    transform?: (res: any) => any; 
}

export default function useRequest(
    _fetch: (...args: any[]) => ReturnType<typeof fetch>,
    useDeps?: Array<any> | UseRequestConfig,
    useConfig?: UseRequestConfig
): {
    data: any,
    loading: boolean,
    error: false | Error,
    start: (args: any, options?: { notSet?: boolean }) => Promise<any>
} {
    let deps = useDeps;
    let config: UseRequestConfig = useConfig || {};

    if (!Array.isArray(deps)) {
        config = deps as UseRequestConfig;
        deps = [];
    }

    const { initialData, manual, transform = _ => _ } = config;

    const [data, setData] = useState<any>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<false | Error>(false);

    let cancel: boolean = false;

    const start = async (params?: any, options: { notSet?: boolean } = {}) => {
        setLoading(true);

        let res = undefined;
        try {
            res = await _fetch(params);
            if (!cancel && !options.notSet) {
                setData(transform(res));
            }
        } catch (err) {
            !cancel && setError(err);
            return Promise.reject(err);
        } finally {
            setLoading(false);
        }

        return Promise.resolve(transform(res));
    }

    useEffect(() => {
        if (!manual) {
            start();
        }

        return () => {
            cancel = true;
        };
    }, deps);

    return { data, loading, error, start };
}