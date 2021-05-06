import { GetDocuments } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { pageId }: { pageId?: number } = {},
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
        (manualParams: any) => GetDocuments(manualParams || { pageId }),
        [pageId, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}