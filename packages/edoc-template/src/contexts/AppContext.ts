import { createContext } from 'react';

const AppContext = createContext<{
    businesses: any[],
    appLoading: boolean
}>({
    businesses: [],
    appLoading: false
});

export default AppContext;