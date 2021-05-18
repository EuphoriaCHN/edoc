import { GetProjectByID } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { projectID }: { projectID?: any } = {},
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
        (manualParams: any) => GetProjectByID(manualParams || { id: projectID }),
        [projectID, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}