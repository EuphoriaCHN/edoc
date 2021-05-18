import * as React from 'react';
import classnames from 'classnames';
import { useHistory, useLocation } from 'umi';
import { REGEXPS } from '@/common/constants';

import AppContext from '@/contexts/AppContext';

import { Layout, Menu, Typography, Avatar } from 'antd';

import { SelectInfo } from 'rc-menu/lib/interface';

import './index.scss';

export interface IProps {
  className?: string;
}

function Header(props: IProps) {
  const [selectBusiness, setSelectBusiness] = React.useState<string[]>([]);

  const { businesses, siteID, setEmptyBusinessDocument, projectData = {} } = React.useContext(AppContext);

  const _history = useHistory();
  const _location = useLocation();

  const businessIDFromURL = _location.pathname.split(REGEXPS.splitIDs)[2];

  const handleSelectBusiness = React.useCallback((info: SelectInfo) => {
    const { selectedKeys } = info;
    if (!!selectedKeys && selectedKeys.length === 1) {
      setEmptyBusinessDocument(false);
      _history.push(`${Edoc.prefix}/${siteID}/${selectedKeys[0]}`);

      setSelectBusiness(selectedKeys as string[]);
    }
  }, []);

  React.useEffect(() => {
    if (!businessIDFromURL && !!businesses.length) {
      _history.replace(`${Edoc.prefix}/${siteID}/${businesses[0].id}`);
      setSelectBusiness([`${businesses[0].id}`])
    }
  }, [businesses]);

  React.useEffect(() => {
    if (!!businessIDFromURL) {
      setSelectBusiness([businessIDFromURL])
    }
  }, []);

  const handleTitleClick = React.useCallback(() => {
    window.location.pathname = `${Edoc.prefix}/${siteID}`;
  }, [projectData]);

  return (
    <Layout.Header
      className={classnames(props.className, 'wrap', 'site-header')}
    >
      <div className={'site-header-title'} onClick={handleTitleClick}>
        <Avatar src={(projectData || {}).feature?.logoSrc} />
        <Typography.Title level={1}>{(projectData || {}).projectName || ''}</Typography.Title>
      </div>
      <Menu
        selectedKeys={selectBusiness} 
        theme={'light'}
        mode={'horizontal'}
        onSelect={handleSelectBusiness}
      >
        {/* Businesses */}
        {businesses.map(item => <Menu.Item key={item.id}>{item.pageName}</Menu.Item>)}
      </Menu>
    </Layout.Header>
  );
}

export default Header;
