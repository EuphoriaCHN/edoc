import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { REGEXPS } from '@/components/RegisterForm';

import { Modal, Form, Input, message } from 'antd';

interface IProps {
    visible: boolean;
    onCancel: () => void;
    onOk: (oldPassword: string, newPassword: string) => Promise<void>;
}

function UpdatePasswordModal(props: IProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (props.visible) {
            form.setFields([
                { name: 'oldPassword', errors: [], value: '' },
                { name: 'newPassword', errors: [], value: '' },
                { name: 'ensurePassword', errors: [], value: '' },
            ]);
        }
    }, [props.visible]);

    const handleOnOk = React.useCallback(async () => {
        const { oldPassword, newPassword, ensurePassword } = form.getFieldsValue(['oldPassword', 'newPassword', 'ensurePassword']);

        let flag = true;

        if (!oldPassword || !oldPassword.length) {
            form.setFields([{ name: 'oldPassword', errors: [t('此项是必填项')] }]);
            flag = false;
        } else if (!REGEXPS.password.test(oldPassword)) {
            form.setFields([{ name: 'oldPassword', errors: [t('密码仅能由 6 到 16 位数字、字母及特殊字符组成')] }]);
            flag = false;
        }

        if (!newPassword || !newPassword.length) {
            form.setFields([{ name: 'newPassword', errors: [t('此项是必填项')] }]);
            flag = false;
        } else if (!REGEXPS.password.test(newPassword)) {
            form.setFields([{ name: 'newPassword', errors: [t('密码仅能由 6 到 16 位数字、字母及特殊字符组成')] }]);
            flag = false;
        }

        if (ensurePassword !== newPassword) {
            form.setFields([{ name: 'ensurePassword', errors: [t('两次输入密码不一致')] }]);
            flag = false;
        } else if (oldPassword !== newPassword) {
            form.setFields([
                { name: 'oldPassword', errors: [t('新密码不能和旧密码一致')] }, 
                { name: 'newPassword', errors: [t('新密码不能和旧密码一致')] }, 
            ]);
            flag = false;
        }

        if (!flag) {
            return;
        }

        setLoading(true);
        try {
            await props.onOk(oldPassword, newPassword);
            message.success(t('密码已修改'));
            props.onCancel();
        } catch (err) {
            message.error(t('修改密码失败'));
            message.error(err.message || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            title={t('修改密码')}
            okText={t('修改')}
            cancelText={t('取消')}
            onOk={handleOnOk}
            okButtonProps={{ loading }}
            cancelButtonProps={{ disabled: loading }}
            maskClosable={!loading}
        >
            <Form form={form}>
                <Form.Item label={t('旧密码')} name={'oldPassword'}>
                    <Input.Password placeholder={t('请输入旧密码')} autoFocus allowClear />
                </Form.Item>
                <Form.Item label={t('新密码')} name={'newPassword'}>
                    <Input.Password placeholder={t('请输入新密码')} allowClear />
                </Form.Item>
                <Form.Item label={t('确认密码')} name={'ensurePassword'}>
                    <Input.Password placeholder={t('请再输入一次新密码')} allowClear />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default UpdatePasswordModal;
