import * as React from 'react';
import { useLocation, useHistory } from 'umi';
import { REGEXPS } from '@/common/constants';

import AppContext from '@/contexts/AppContext';
import useBusinessDocuments from '@/hooks/useBusinessDocuments';

import { Layout, Menu } from 'antd';

import { SelectInfo } from 'rc-menu/lib/interface';

import './index.scss';

export interface IProps {

}

function Sider(props: IProps) {
  const [selectDocID, setSelectDocID] = React.useState<string[]>([]);
  const { setEmptyBusinessDocument } = React.useContext(AppContext);

  const _location = useLocation();
  const _history = useHistory();

  const [_, siteID, businessID, documentID] = _location.pathname.split(REGEXPS.splitIDs);

  const { 
    data: businessDocument, 
    start: loadBusinessDocument, 
    loading
  } = useBusinessDocuments({}, [], { manual: true });

  React.useEffect(() => {
    // 切换了页面库
    loadBusinessDocument({ id: businessID }).then(value => {
      if (!value) {
        return setEmptyBusinessDocument(true);
      }
      const first = value[0];
      if (!first) {
        return;
      }
      if (!!first.isDir) {
        const firstChild = (value.children || [])[0];
        if (!!firstChild) {
          setSelectDocID([`${firstChild.id}`]); 
          _history.replace(`${Edoc.prefix}/${siteID}/${businessID}/${firstChild.id}`);
        }
      } else {
        setSelectDocID([`${first.id}`]);
        _history.replace(`${Edoc.prefix}/${siteID}/${businessID}/${first.id}`);
      }
    });
  }, [businessID]);

  React.useEffect(() => {
    if (!!documentID) {
      setSelectDocID([documentID]);
    }
  }, []);

  const handleSiderSelect = React.useCallback((info: SelectInfo) => {
    if (!!info.selectedKeys && !!info.selectedKeys.length) {
      _history.push(`${Edoc.prefix}/${siteID}/${businessID}/${info.selectedKeys[0]}`);
      setSelectDocID(info.selectedKeys as string[]);
    }
  }, [businessID]);

  const handleOnOpenChange = React.useCallback((openKeys: React.Key[]) => {
    // console.log(openKeys);
  }, []);

  return (
    <Layout.Sider
      className={'side-nav'}
      style={{ height: '100%' }}
    >
      <Menu
        mode="inline"
        style={{ height: '100%' }}
        onSelect={handleSiderSelect}
        selectedKeys={selectDocID}
        onOpenChange={handleOnOpenChange}
      >
        {(businessDocument || []).map((item: any) => !!item.isDir ? (
          <Menu.SubMenu key={item.id} title={item.documentName}>
            {item.children.map((child: any) => <Menu.Item key={child.id}>{child.documentName}</Menu.Item>)}
          </Menu.SubMenu>
        ) : <Menu.Item key={item.id}>{item.documentName}</Menu.Item>)}
      </Menu>
    </Layout.Sider>
  );
}

export default Sider;