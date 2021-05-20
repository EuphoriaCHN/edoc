import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useDispatch, useSelector } from 'react-redux';
import { Store } from '@/store';
import { nanoid } from '@reduxjs/toolkit';
import { updateProjectInfo } from '@/store/ProjectStore';

import { ProjectAPI } from '@/api';

import { Descriptions, Spin, message, Tooltip, Avatar, Button } from 'antd';
import UploadImageModal from '@/components/UploadImageModal';
import UpdateProjectDescriptionModal from '@/components/UpdateProjectDescriptionModal';

interface IProps {

}

function ProjectBaseInfo(this: any, props: IProps) {
  const [updateProjectDescriptionModalVisible, setUpdateProjectDescriptionModalVisible] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();

  const _dispatch = useDispatch();
  const projectState = useSelector<Store, Store['project']>(state => state.project);

  /**
   * 修改项目简介
   */
  const handleChangeProjectDescription = React.useCallback(async (projectDescription: string) => {
    await ProjectAPI.updateProject({
      id: projectState.project.id,
      projectDesc: projectDescription
    });
    _dispatch(updateProjectInfo({
      id: nanoid(),
      project: { projectDesc: projectDescription }
    }));
  }, [projectState.project.id]);

  /**
   * 修改项目头像
   */
  const handleUpdateProjectLogo = React.useCallback(async (url: string) => {
    try {
      setLoading(true);
      await ProjectAPI.updateProject({
        id: projectState.project.id,
        feature: { logoSrc: url }
      });
      _dispatch(updateProjectInfo({
        id: nanoid(),
        project: { feature: { logoSrc: url }}
      }));
      message.success(t('项目 Logo 已更新'))
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('更新项目 Logo 失败'));
    } finally {
      setLoading(false);
    }
  }, [projectState.project.id]);

  return (
    <React.Fragment>
      <Spin spinning={loading || !projectState.project.id}>
        <Descriptions bordered>
          <Descriptions.Item span={2} label={t('项目名称')}>
            {projectState.project.projectName}
          </Descriptions.Item>
          <Descriptions.Item span={1} label={t('项目 Logo')}>
            <UploadImageModal onSuccess={handleUpdateProjectLogo}>
              <Tooltip title={t('点击上传')}>
                <Avatar
                  size={'large'}
                  style={{ cursor: 'pointer' }}
                  src={projectState.project.feature?.logoSrc}
                />
              </Tooltip>
            </UploadImageModal>
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('项目简介')}>
            {projectState.project.projectDesc || t('未设置')}
            <Button style={{ marginLeft: 16 }} onClick={setUpdateProjectDescriptionModalVisible.bind(this, true)}>{t('点击修改')}</Button>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
      <UpdateProjectDescriptionModal
        visible={updateProjectDescriptionModalVisible}
        onCancel={setUpdateProjectDescriptionModalVisible.bind(this, false)}
        defaultValue={projectState.project.projectDesc || ''}
        onOk={handleChangeProjectDescription}
      />
    </React.Fragment>
  );
}

export default ProjectBaseInfo;
