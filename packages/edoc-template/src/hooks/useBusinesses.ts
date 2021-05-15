import { GetBusinesses } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { ownerProjectId }: { ownerProjectId?: number | string | null } = {},
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
        (manualParams: any) => GetBusinesses(manualParams || { data: { ownerProjectId } }),
        [ownerProjectId, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}