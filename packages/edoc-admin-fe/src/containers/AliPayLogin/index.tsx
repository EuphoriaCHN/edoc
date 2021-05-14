import * as React from 'react';
import { useLocation, useHistory } from 'umi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { AccountAPI } from '@/api';
import Cookie from 'js-cookie';
import Loading from '@/containers/Loading';

interface IProps {

}

function AliPayLogin(props: IProps) {
    const { t } = useTranslation();
    const _location = useLocation();
    const _history = useHistory();

    React.useEffect(() => {
        const aliPayAuthCode = _location.search.split(/auth_code=([a-zA-Z0-9]+)/)[1];

        if (!aliPayAuthCode) {
            message.error(t('校验码失效，请重试'));
            _history.push('/');
            return;
        }

        AccountAPI.aliPayLogin({
            alipayAuthCode: aliPayAuthCode
        }).then(({ data }) => {
            const { headerValue } = data;
            Cookie.set(AUTHORIZATION_KEY, headerValue, { expires: 1 });
            message.success(t('验证成功'));
            _history.push('/');
        }, err => {
            message.error(t('登陆失败，请重试'))
            message.error(err.message || JSON.stringify(err));
        });
    }, []);

    return <Loading />;
}

export default AliPayLogin;
