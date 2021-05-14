import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '@/store/UserStore';
import { Store } from '@/store';
import { nanoid } from '@reduxjs/toolkit';

import { Descriptions, Avatar, Button, Tooltip, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import UploadImageModal from '@/components/UploadImageModal';

import './index.scss';

interface IProps {

}

function ProfileDescriptions(props: IProps) {
  const { t } = useTranslation();
  const _dispatch = useDispatch();

  const { user } = useSelector<Store, Store['user']>(state => state.user);

  const handleOnAvatarUploadSuccess = React.useCallback((url: string) => {
    _dispatch(setAvatar({
      id: nanoid(),
      avatar: url
    }));
    message.success(t('更新头像成功'));
  }, []);

  return (
    <Descriptions title={t('个人信息')} bordered>
      <Descriptions.Item span={3} label={t('头像')}>
        <UploadImageModal onSuccess={handleOnAvatarUploadSuccess}>
          <Tooltip title={t('点击上传')}>
            <Avatar
              size={'large'}
              src={user.avatarLink || undefined}
              icon={!!user.avatarLink ? undefined : <UserOutlined />}
              style={{ cursor: 'pointer' }}
            />
          </Tooltip>
        </UploadImageModal>
      </Descriptions.Item>
      <Descriptions.Item span={2} label={t('账号')}>{user.account || '-'}</Descriptions.Item>
      <Descriptions.Item span={1}>
        <Button>{t('修改账号')}</Button>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={t('密码')}>
        <Button>{t('修改密码')}</Button>
      </Descriptions.Item>
      <Descriptions.Item span={2} label={t('昵称')}>{user.userName || t('未设置')}</Descriptions.Item>
      <Descriptions.Item span={1}>
        <Button>{t('修改昵称')}</Button>
      </Descriptions.Item>
      <Descriptions.Item span={3} label={t('手机号')}>{user.mobile || t('未设置')}</Descriptions.Item>
    </Descriptions>
  );
}

export default ProfileDescriptions;
