import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { setPageLibrary } from '@/store/ProjectStore';

import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import CreatePageLibraryModal from '@/components/CreatePageLibraryModal';
import CardFilterContent from '@/components/CardFilterContent';

import { PageLibraryAPI } from '@/api';

import './index.scss';

interface IProps {

}

function PageLibrary(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [createPageLibraryModalVisible, setCreatePageLibraryModalVisible] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const { siteID } = useParams<{ siteID: string }>();
  const _history = useHistory();
  const _dispatch = useDispatch();

  const {
    data: pageLibrary,
    start: loadPageLibrary,
    loading: pageLibraryLoading
  } = PageLibraryAPI.usePageLibraryList({ manual: true });

  const onCardClick = React.useCallback((pageLibrary: any) => {
    _dispatch(setPageLibrary({
      id: nanoid(),
      pageLibrary
    }));

    _history.push(`/siteDetail/${siteID}/${pageLibrary.ID}`);
  }, [siteID]);

  const loadData = React.useCallback((queryData: any) => {
    loadPageLibrary(Object.assign({ ownerProjectId: siteID }, queryData || {}));
  }, [siteID]);

  /**
   * 删除页面库
   */
  const handleDeleteBusiness = React.useCallback(async (business: any) => {
    try {
      setLoading(true);
      await PageLibraryAPI.deletePageLibrary({ id: business.id });

      message.success(t('页面库已删除'));
      loadPageLibrary({ page: 1, size: 8 });
    } catch (err) {
      message.error(t('删除页面库失败'));
      message.error(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 新增页面库
   */
  const handleCreateBusiness = React.useCallback(async (params: { pageName: string; pageDesc: string }) => {
    await PageLibraryAPI.createPageLibrary({
      ownerProjectId: siteID,
      pageName: params.pageName,
      pageDesc: params.pageDesc
    });

    message.success(t('站点已创建'));
    loadPageLibrary({ page: 1, size: 8 });
  }, [siteID]);

  React.useEffect(() => {
    if (!siteID) {
      message.error(t('错误的站点 ID'));
      return;
    }
  }, []);

  return (
    <React.Fragment>
      <CardFilterContent
        dataSource={pageLibrary?.data || []}
        headerOptions={{
          inputs: [{
            placeHolder: t('搜索页面库'),
            prefix: <SearchOutlined />,
            name: 'searchValue',
          }],
          baseButtons: [{
            text: t('新建页面库'),
            icon: <PlusOutlined />,
            type: 'primary',
            onClick: setCreatePageLibraryModalVisible.bind(this, true)
          }]
        }}
        empty={{
          description: t('暂无数据')
        }}
        loading={pageLibraryLoading || loading}
        total={pageLibrary?.total || 0}
        loadData={loadData}
        onCardClick={onCardClick}
        onCardDelete={handleDeleteBusiness}
      />
      <CreatePageLibraryModal
        visible={createPageLibraryModalVisible}
        onCancel={setCreatePageLibraryModalVisible.bind(this, false)}
        onOk={handleCreateBusiness}
      />
    </React.Fragment>
  );
}

export default PageLibrary;
