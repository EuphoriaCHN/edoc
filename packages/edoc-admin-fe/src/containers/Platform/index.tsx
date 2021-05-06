import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { ProjectAPI } from '@/api';
import { useHistory } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { setProject } from '@/store/ProjectStore';

import { PageHeader, Tabs, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import CreateProjectModal from '@/components/CreateProjectModal';
import CardFilterContent from '@/components/CardFilterContent';

import './index.scss';

interface IProps {

}

function Platform(props: IProps) {
  const [createProjectModalVisible, setCreateProjectModalVisible] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const _history = useHistory();
  const _dispatch = useDispatch();

  const {
    data: projectListData,
    start: loadProjectList,
    loading: projectListLoading,
    error: loadProjectListDataError
  } = ProjectAPI.useProjectList({ manual: true });

  React.useEffect(() => {
    if (!!loadProjectListDataError) {
      message.error(loadProjectListDataError.message);
    }
  }, [loadProjectListDataError]);

  /**
   * 跳转至【站点详情页】
   */
  const handleCardClick = React.useCallback((project: any) => {
    _dispatch(setProject({
      id: nanoid(),
      project
    }));

    _history.push(`/siteDetail/${project.ID}`);
  }, []);

  /**
   * 删除项目
   */
  const handleDeleteProject = React.useCallback(async (project: any) => {
    console.log(project);
  }, []);

  return (
    <React.Fragment>
      <div className={'platform content-container'}>
        <PageHeader
          title={t('站点列表')}
          subTitle={t('选择并管理你的文档站点')}
          footer={(
            <Tabs defaultActiveKey={'all'}>
              <Tabs.TabPane tab={t('全部站点')} tabKey={'all'} />
            </Tabs>
          )}
          className={'platform-header'}
        />
        <CardFilterContent
          dataSource={projectListData?.list || []}
          headerOptions={{
            inputs: [{
              placeHolder: t('搜索站点'),
              prefix: <SearchOutlined />,
              name: 'searchValue',
            }],
            baseButtons: [{
              text: t('新建站点'),
              icon: <PlusOutlined />,
              type: 'primary',
              onClick: () => setCreateProjectModalVisible(true)
            }]
          }}
          empty={{
            description: t('暂无数据')
          }}
          loading={projectListLoading}
          total={projectListData?.total || 0}
          loadData={loadProjectList}
          onCardClick={handleCardClick}
          onCardDelete={handleDeleteProject}
        />
      </div>
      <CreateProjectModal
        visible={createProjectModalVisible}
        onCancel={() => setCreateProjectModalVisible(false)}
      />
    </React.Fragment>
  );
}

export default Platform;
