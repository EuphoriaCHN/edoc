import { GetDocumentContent } from './api';
import useRequest, { UseRequestConfig } from './api/useRequest';

export default function(
    { documentID }: { documentID?: number } = {},
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
        (manualParams: any) => GetDocumentContent(manualParams || { documentID }),
        [documentID, ...deps],
        {
            initialData: [],
            transform: _ => _,
            ...config
        }
    );
}