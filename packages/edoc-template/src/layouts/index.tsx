import * as React from 'react';

import { Layout, Typography } from 'antd';
import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Content from '@/components/Contents';
import NotFound from '@/components/NotFound';
import EmptyBusinessDocument from '@/components/EmptyBusinessDocument';

import AppContext from '@/contexts/AppContext';

import useProjectByID from '@/hooks/useProjectByID';
import useSiteID from '@/hooks/useSiteID';
import useBusinesses from '@/hooks/useBusinesses';

import BeiAnLogo from '@/common/images/BeiAn.png';

import './index.scss';

function LayoutWrapper(props: React.PropsWithChildren<{}>) {
  const [emptyBusinessDocument, setEmptyBusinessDocument] = React.useState<boolean>(false);
  const siteID = useSiteID();

  const { data: businesses, loading: getBusinessesLoading } = useBusinesses({ ownerProjectId: siteID || null }, []);
  const { data: projectData, loading: getProjectLoading } = useProjectByID({
    projectID: siteID || null,
    Edcs_482qr53fc: 'EgvF9E!2%NtIr5wmjL7Y@WFn@YrvvRa5v&j'
  }, []);

  return (
    <AppContext.Provider
      value={{
        businesses,
        appLoading: getBusinessesLoading || getProjectLoading,
        siteID,
        emptyBusinessDocument,
        setEmptyBusinessDocument,
        projectData
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
        <Layout.Footer className={'site-footer'}>
          <div className={'site-footer-beian'}>
            <img src={BeiAnLogo} />
            <Typography.Link target={'__blank'} href={'http://www.beian.miit.gov.cn/'}>陕ICP备 2021006075号-1</Typography.Link>
          </div>
        </Layout.Footer>
      </Layout>
    </AppContext.Provider>
  )
}

export default LayoutWrapper;
