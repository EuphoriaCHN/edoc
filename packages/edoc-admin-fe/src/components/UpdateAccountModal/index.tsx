import * as React from 'react';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';
import { useHistory } from 'umi';

import { Modal, Form, Input, message, Typography } from 'antd';

interface IProps {
    visible: boolean;
    onCancel: () => void;
    defaultValue: string | null;

    onOk: (data: string) => Promise<void>;
}

function UpdateAccountModal(props: IProps) {
    const [loading, setLoading] = React.useState<boolean>(false);
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const _history = useHistory();

    const handleOnOk = React.useCallback(async () => {
        const account = form.getFieldValue('account');

        setLoading(true);
        try {
            await props.onOk(account);
            Cookie.remove(AUTHORIZATION_KEY);
            message.success(t('账号已修改，请重新登陆'));
            _history.replace('/');
            props.onCancel();
        } catch (err) {
            message.error(t('修改账号失败'));
            message.error(err.message || JSON.stringify(err));
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (props.visible) {
            form.setFields([{
                name: 'account',
                value: props.defaultValue || ''
            }]);
        }
    }, [props.visible, props.defaultValue]);

    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            title={t('修改账号')}
            okText={t('修改')}
            cancelText={t('取消')}
            onOk={handleOnOk}
            okButtonProps={{ loading }}
            cancelButtonProps={{ disabled: loading }}
            maskClosable={!loading}
        >
            <Form form={form}>
                <Form.Item label={t('账号')} name={'account'}>
                    <Input placeholder={t('请输入账号')} autoFocus allowClear />
                </Form.Item>
                <Typography.Text type={'danger'}>{t('修改成功后需要重新登陆')}</Typography.Text>
            </Form>
        </Modal>
    );
}

export default UpdateAccountModal;
