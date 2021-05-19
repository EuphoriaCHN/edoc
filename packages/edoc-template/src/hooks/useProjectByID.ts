import { GetProjectByID } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { projectID, Edcs_482qr53fc }: { projectID?: any, 'Edcs_482qr53fc'?: any } = {},
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
        (manualParams: any) => GetProjectByID(manualParams || { id: projectID, Edcs_482qr53fc }),
        [projectID, Edcs_482qr53fc, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}