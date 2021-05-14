import * as React from 'react';
import { useLocation, useHistory } from 'umi';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import Cookie from 'js-cookie';
import Loading from '@/containers/Loading';

import { AccountAPI } from '@/api';

interface IProps {

}

function AliPayLogin(props: IProps) {
    const { t } = useTranslation();
    const _location = useLocation();
    const _history = useHistory();

    /**
     * 为了登录而重定向
     */
    const redirectToLogin = React.useCallback(async (aliPayAuthCode: string) => {
        try {
            const { data } = await AccountAPI.aliPayLogin({
                alipayAuthCode: aliPayAuthCode
            });
            const { headerValue } = data;
            Cookie.set(AUTHORIZATION_KEY, headerValue, { expires: 1 });
            message.success(t('验证成功'));
        } catch (err) {
            message.error(t('登陆失败，请重试'));
            message.error(err.message || JSON.stringify(err));
        } finally {
            _history.push('/');
        }
    }, []);

    /**
     * 为了更新支付宝绑定信息而重定向
     */
    const redirectToUpdateAliPayAccount = React.useCallback(async (aliPayAuthCode: string) => {
        try {
            const userId = _location.search.split(/ui=([a-zA-Z0-9]+)/)[1];
            const account = _location.search.split(/ac=([a-zA-Z0-9]+)/)[1];

            if (!userId || !account) {
                throw new Error(t('错误 UserID 或 Account'));
            }

            await AccountAPI.updateAliPay({
                userId,
                alipayAuthCode: aliPayAuthCode,
                account
            });
            message.success(t('操作成功'));
            _history.push('/userCenter');
        } catch (err) {
            message.error(t('登陆失败，请重试'));
            message.error(err.message || JSON.stringify(err));
            _history.push('/');
        }
    }, []);

    React.useEffect(() => {
        const aliPayAuthCode = _location.search.split(/auth_code=([a-zA-Z0-9]+)/)[1];
        const redirectBase = _location.search.split(/redirectBase=([a-zA-Z0-9]+)/)[1] || 'home';

        if (!aliPayAuthCode) {
            message.error(t('校验码失效，请重试'));
            _history.push('/');
            return;
        }

        switch (redirectBase) {
            case 'home':
                redirectToLogin(aliPayAuthCode);
                break;
            case 'userCenter':
                redirectToUpdateAliPayAccount(aliPayAuthCode);
                break;
            default:
                message.error(t('重定向错误'));
                _history.push('/');
        }
    }, []);

    return <Loading />;
}

export default AliPayLogin;
