import React from 'react';
import { Layout, Typography } from 'antd';

import BeiAnLogo from '@/common/images/BeiAn.png';

import './index.scss';

interface IProps {

}

function Footer(props: IProps) {
  const startYear = React.useMemo<number>(() => 2021, []);
  const nowYear = new Date().getFullYear();

  return (
    <Layout.Footer className={'site-footer'}>
      <div>
        <Typography.Text>海弘建站</Typography.Text>
        <Typography.Text>&copy; {nowYear === startYear ? startYear : `${startYear} ~ ${nowYear}`}</Typography.Text>
        <Typography.Text>Xi`an University of Science and Technology</Typography.Text>
      </div>
      <div className={'site-footer-beian'}>
        <img src={BeiAnLogo} />
        <a target={'__blank'} href={'http://www.beian.miit.gov.cn/'}>陕ICP备 2021006075号-1</a>
      </div>
    </Layout.Footer>
  );
}

export default Footer;
