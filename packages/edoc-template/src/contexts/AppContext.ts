import * as React from 'react';

const AppContext = React.createContext<{
    businesses: any[],
    appLoading: boolean,
    siteID: string,
    emptyBusinessDocument: boolean,
    setEmptyBusinessDocument: React.Dispatch<React.SetStateAction<boolean>>,
    projectData: any
}>({
    businesses: [],
    appLoading: false,
    siteID: '',
    emptyBusinessDocument: false,
    setEmptyBusinessDocument: () => {},
    projectData: {}
});

export default AppContext;