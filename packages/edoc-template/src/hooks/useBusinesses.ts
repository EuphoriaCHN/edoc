import { GetBusinesses } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { projectID }: { projectID?: number } = {},
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
        (manualParams: any) => GetBusinesses(manualParams || { projectID }),
        [projectID, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}