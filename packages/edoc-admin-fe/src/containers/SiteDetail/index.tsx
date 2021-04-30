import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'umi';
import { breadcrumbItemRender } from '@/common/utils';

import { useSelector, useDispatch } from 'react-redux';
import { Store } from '@/store';
import { setProject } from '@/store/ProjectStore';
import { nanoid } from '@reduxjs/toolkit';

import { ProjectAPI } from '@/api';

import { PageHeader, Spin, message, Tabs } from 'antd';
import PageLibrary from '@/containers/PageLibrary';

import { Route as BreadcrumbRoute } from 'antd/lib/breadcrumb/Breadcrumb';

import './index.scss';

interface IProps {

}

enum SiteDetailTabPane {
  pageLibrary = 'pageLibrary'
}

function SiteDetail(props: IProps) {
  const [isError, setIsError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tabPaneActiveKey, setTabPaneActiveKey] = React.useState<SiteDetailTabPane>(SiteDetailTabPane.pageLibrary);

  const { t } = useTranslation();
  const projectState = useSelector<Store, Store['project']>(state => state.project);
  const { siteID } = useParams<{ siteID: string }>();
  const _dispatch = useDispatch();
  const _history = useHistory();

  /**
   * 面包屑导航
   */
  const breadcrumbRoutes = React.useMemo<BreadcrumbRoute[]>(() => [{
    path: '/',
    breadcrumbName: t('首页'),
  }, {
    path: `/siteDetail/${projectState.project?.ID || 0}`,
    breadcrumbName: projectState.project?.name || t('加载中...')
  }], [projectState.project]);

  /**
   * Tabs 数据
   */
  const tabsData = React.useMemo(() => [{
    activeKey: SiteDetailTabPane.pageLibrary,
    tabName: t('页面库'),
    component: <PageLibrary />
  }], []);

  /**
   * 加载数据
   */
  const loadData = React.useCallback(async () => {
    setLoading(true);
    setIsError(false);
    try {
      if (!projectState.project.ID) {
        const projectData = await ProjectAPI.getProjectByID({ siteID });
        _dispatch(setProject({
          id: nanoid(),
          project: projectData
        }));
      }
    } catch (err) {
      message.error(typeof err === 'string' ? err : err.message || JSON.stringify(err));
      message.error(t('获取项目详情失败'));
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 当 Tab 变化时
   */
  const handleTabChange = React.useCallback((activeKey: SiteDetailTabPane) => {
    setTabPaneActiveKey(activeKey);
    window.location.hash = `#${activeKey}`;
  }, []);


  React.useEffect(() => {
    if (!siteID) {
      message.error(t('错误的站点 ID'));
      setIsError(true);
      return;
    }
    if (!window.location.hash.length) {
      window.location.hash = `#${SiteDetailTabPane.pageLibrary}`;
    }
    loadData();
  }, []);


  return (
    <div className={'content-container site-detail'}>
      <Spin spinning={loading}>
        <PageHeader
          title={t('站点详情')}
          subTitle={t('进行页面库配置与站点管理')}
          breadcrumb={{ routes: breadcrumbRoutes, itemRender: breadcrumbItemRender }}
          onBack={() => _history.replace('/')}
          footer={(
            <Tabs activeKey={tabPaneActiveKey} onChange={handleTabChange.bind(this)}>
              {tabsData.map(item =>
                <Tabs.TabPane tab={item.tabName} key={item.activeKey}>
                  {isError ? null : item.component}
                </Tabs.TabPane>
              )}
            </Tabs>
          )}
        />
      </Spin>
    </div>
  );
}

export default SiteDetail;
