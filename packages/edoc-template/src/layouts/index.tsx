import * as React from 'react';

import { Layout } from 'antd';
import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Content from '@/components/Contents';
import NotFound from '@/components/NotFound';

import AppContext from '@/contexts/AppContext';

import useSiteID from '@/hooks/useSiteID';
import useBusinesses from '@/hooks/useBusinesses';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  const siteID = useSiteID();
  const { data: businesses, loading } = useBusinesses({ id: siteID || null }, []);

  return (
    <AppContext.Provider
      value={{
        businesses,
        appLoading: loading,
        siteID
      }}
    >
      <Layout>
        {!!siteID ? <Header /> : null}
        <Layout className={'site-container'}>
          {!!siteID ? (
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
