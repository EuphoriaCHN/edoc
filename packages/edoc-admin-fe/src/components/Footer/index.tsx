import * as React from 'react';
import { useLocation } from 'react-router-dom';

import { Layout, Typography } from 'antd';

import './index.scss';

interface IProps {

}

function Footer (props: IProps) {
  const [visible, setVisible] = React.useState<boolean>(true);

  const _location = useLocation();

  const startYear = React.useMemo<number>(() => 2021, []);
  const nowYear = new Date().getFullYear();

  // 如果进入到了文档编辑页面，不展示 Footer
  React.useEffect(() => {
    if (/^\/siteDetail\/\d+\/\d+\/\d+/.test(_location.pathname)) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [_location.pathname]);

  if (!visible) {
    return null;
  }

  return (
    <Layout.Footer className={'site-footer'}>
      <Typography.Text>Qinhong Wang</Typography.Text>
      <Typography.Text>&copy; {nowYear === startYear ? startYear : `${startYear} ~ ${nowYear}`}</Typography.Text>
      <Typography.Text>Xi`an University of Science and Technology</Typography.Text>
    </Layout.Footer>
  );
}

export default Footer;
