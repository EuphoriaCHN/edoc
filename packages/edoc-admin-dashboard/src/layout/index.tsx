import React from 'react';
import { Layout as AntDLayout } from 'antd';

import Header from '@/components/Header';
import Sider from '@/components/Sider';
import Footer from '@/components/Footer';

import './index.scss';

function Layout(props: React.PropsWithChildren<{}>) {
  return (
    <AntDLayout>
      <Header />
      <AntDLayout>
        <Sider />
        <AntDLayout.Content className={'site-content'}>
          {props.children}
        </AntDLayout.Content>
      </AntDLayout>
      <Footer />
    </AntDLayout>
  );
}

export default Layout;
