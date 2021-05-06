import * as React from 'react';

import { Layout } from 'antd';
import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Content from '@/components/Contents';

import AppContext from '@/contexts/AppContext';

import useSiteID from '@/hooks/useSiteID';
import useBusinesses from '@/hooks/useBusinesses';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  const siteID = useSiteID();
  const { data: businesses, loading } = useBusinesses({ projectID: siteID }, []);

  return (
    <AppContext.Provider
      value={{
        businesses,
        appLoading: loading
      }}
    >
      <Layout>
        <Header />
        <Layout className={'site-container'}>
          <Sider />
          <Content />
        </Layout>
      </Layout>
    </AppContext.Provider>
  )
}

export default LayoutWrapper;
