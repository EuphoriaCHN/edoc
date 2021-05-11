import { GetDocuments } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { id }: { id?: number } = {},
    useDeps: any[] = [],
    useConfig: UseRequestConfig = {}
) {
    let deps = useDeps;
    let config: UseRequestConfig = useConfig;

    if (!Array.isArray(deps)) {
        config = deps;
        deps = [];
    }

    return useRequest(
        (manualParams: any) => GetDocuments(manualParams || { id }),
        [id, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}