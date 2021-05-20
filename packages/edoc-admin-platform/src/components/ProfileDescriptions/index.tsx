import * as React from 'react';
import { useTranslation } from 'react-i18next';
import classnames from 'classnames';

import { useSelector, useDispatch } from 'react-redux';
import { setAvatar, setGender, setNickName, GENDER, GENDER_DICT, setUser } from '@/store/UserStore';
import { Store } from '@/store';
import { nanoid } from '@reduxjs/toolkit';

import { Descriptions, Avatar, Button, Tooltip, message, Dropdown, Menu, Spin } from 'antd';
import { UserOutlined, AlipayCircleOutlined } from '@ant-design/icons';

import UploadImageModal from '@/components/UploadImageModal';
import UpdateNickNameModal from '@/components/UpdateNickNameModal';
import UpdateAccountModal from '@/components/UpdateAccountModal';
import UpdatePasswordModal from '@/components/UpdatePasswordModal';

import { AccountAPI } from '@/api';

import { MenuClickEventHandler } from 'rc-menu/lib/interface';

import './index.scss';

interface IProps {

}

function ProfileDescriptions(this: any, props: IProps) {
  const [updateNickNameModalVisible, setUpdateNickNameModalVisible] = React.useState<boolean>(false);
  const [updateAccountModalVisible, setUpdateAccountModalVisible] = React.useState<boolean>(false);
  const [updatePasswordModalVisible, setUpdatePasswordModalVisible] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);
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

  /**
   * 修改性别
   */
  const handleChangeUserGender = React.useCallback<MenuClickEventHandler>(async ({ key }) => {
    try {
      setLoading(true);
      await AccountAPI.updateInfo({
        gender: key,
        userId: user.userId
      });
      _dispatch(setGender({
        id: nanoid(),
        gender: key
      }));
      message.success(t('性别已更新'));
    } catch (err) {
      message.error(t('更新性别失败'));
      message.error(err.message || JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  }, [user.userId]);

  /**
   * 修改昵称
   */
  const handleChangeNickName = React.useCallback(async (data: string) => {
    await AccountAPI.updateInfo({
      userName: data,
      userId: user.userId
    });
    _dispatch(setNickName({
      id: nanoid(),
      nickName: data
    }));
  }, []);

  /**
   * 修改账号
   */
  const handleChangeAccount = React.useCallback(async (data: string) => {
    await AccountAPI.updateInfo({
      account: data,
      userId: user.userId
    });
    _dispatch(setUser({
      user: {},
      id: nanoid()
    }));
  }, []);

  /**
   * 修改密码
   */
  const handleChangePassword = React.useCallback(async (oldPassword, newPassword) => {
    await AccountAPI.updatePassword({
      userId: user.userId,
      account: user.account,
      newPassword,
      originPassword: oldPassword
    });
  }, []);

  /**
   * 绑定 / 修改绑定支付宝账号
   */
  const handleChangeAliPayAccount = React.useCallback(() => {
    window.open(
      `https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2021002144604032&scope=auth_user&redirect_uri=http%3A%2F%2Fedoc.bhj-noshampoo.site%2FAliPayLogin%3FredirectBase%3DuserCenter%26ui%3D${user.userId}%26ac%3D${user.account}`,
      '_self'
    );
  }, []);

  const GenderIcon = React.useMemo(() => GENDER_DICT[user.gender || GENDER.UNKNOWN].Component, [user.gender]);

  return (
    <React.Fragment>
      <Spin spinning={loading}>
        <Descriptions title={t('个人信息')} className={'profile'} bordered>
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
          <Descriptions.Item span={2} label={t('性别')}>
            <Tooltip title={t(GENDER_DICT[user.gender || GENDER.UNKNOWN].text)}>
              <span
                className={classnames('profile-gender', {
                  'profile-gender-male': user.gender === GENDER.MALE,
                  'profile-gender-female': user.gender === GENDER.FEMALE
                })}
              >
                <GenderIcon />
              </span>
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item span={1}>
            <Dropdown
              trigger={['click']}
              overlay={(
                <Menu
                  onClick={handleChangeUserGender}
                  selectedKeys={[user.gender || GENDER.UNKNOWN]}
                >
                  {Object.keys(GENDER_DICT).map(key => {
                    const item = (GENDER_DICT as any)[key];
                    const GenderIcon = item.Component;
                    return (
                      <Menu.Item key={key} icon={<GenderIcon />}>{t(item.text)}</Menu.Item>
                    );
                  })}
                </Menu>
              )}
            >
              <Button>{t('修改性别')}</Button>
            </Dropdown>
          </Descriptions.Item>
          <Descriptions.Item span={2} label={t('账号')}>{user.account || '-'}</Descriptions.Item>
          <Descriptions.Item span={1}>
            <Button onClick={setUpdateAccountModalVisible.bind(this, true)}>{t('修改账号')}</Button>
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('密码')}>
            <Button onClick={setUpdatePasswordModalVisible.bind(this, true)}>{t('修改密码')}</Button>
          </Descriptions.Item>
          <Descriptions.Item span={2} label={t('昵称')}>{user.userName || t('未设置')}</Descriptions.Item>
          <Descriptions.Item span={1}>
            <Button onClick={setUpdateNickNameModalVisible.bind(this, true)}>{t('修改昵称')}</Button>
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('手机号')}>{user.mobile || t('未设置')}</Descriptions.Item>
          <Descriptions.Item span={2} label={t('支付宝账号')}>{user.alipayNickName || t('未绑定')}</Descriptions.Item>
          <Descriptions.Item span={1}>
            <Button onClick={handleChangeAliPayAccount} icon={<AlipayCircleOutlined />}>{user.alipayNickName ? t('修改绑定账号') : t('绑定支付宝')}</Button>
          </Descriptions.Item>
        </Descriptions>
      </Spin>
      <UpdateNickNameModal
        visible={updateNickNameModalVisible}
        onCancel={setUpdateNickNameModalVisible.bind(this, false)}
        defaultValue={user.userName}
        onOk={handleChangeNickName}
      />
      <UpdateAccountModal
        visible={updateAccountModalVisible}
        onCancel={setUpdateAccountModalVisible.bind(this, false)}
        defaultValue={user.account}
        onOk={handleChangeAccount}
      />
      <UpdatePasswordModal
        visible={updatePasswordModalVisible}
        onCancel={setUpdatePasswordModalVisible.bind(this, false)}
        onOk={handleChangePassword}
      />
    </React.Fragment>
  );
}

export default ProfileDescriptions;
