import { createContext } from 'react';

const AppContext = createContext<{
    businesses: any[],
    appLoading: boolean,
    siteID: string
}>({
    businesses: [],
    appLoading: false,
    siteID: ''
});

export default AppContext;