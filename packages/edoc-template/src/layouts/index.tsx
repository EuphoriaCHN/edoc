import * as React from 'react';

import { Layout } from 'antd';
import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Content from '@/components/Contents';
import NotFound from '@/components/NotFound';
import EmptyBusinessDocument from '@/components/EmptyBusinessDocument';

import AppContext from '@/contexts/AppContext';

import useSiteID from '@/hooks/useSiteID';
import useBusinesses from '@/hooks/useBusinesses';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  const [emptyBusinessDocument, setEmptyBusinessDocument] = React.useState<boolean>(false);
  const siteID = useSiteID();
  const { data: businesses, loading } = useBusinesses({ ownerProjectId: siteID || null }, []);

  return (
    <AppContext.Provider
      value={{
        businesses,
        appLoading: loading,
        siteID,
        emptyBusinessDocument,
        setEmptyBusinessDocument
      }}
    >
      <Layout>
        {!!siteID ? <Header /> : null}
        <Layout className={'site-container'}>
          {emptyBusinessDocument ? (
            <Layout.Content>
              <EmptyBusinessDocument />
            </Layout.Content>
          ) : !!siteID ? (
            <React.Fragment>
              <Sider />
              <Content />
            </React.Fragment>
          ) : (
            <Layout.Content>
              <NotFound />
            </Layout.Content>
          )}
        </Layout>
      </Layout>
    </AppContext.Provider>
  )
}

export default LayoutWrapper;
