import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { setForbidden } from '@/store/GlobalStore';
import Store from '@/store';

import { Button, Result } from 'antd';

interface IProps { }

function Forbidden (props: IProps) {
  const { t } = useTranslation();
  const _history = useHistory();

  const handleBackToHome = React.useCallback(() => {
    Store.dispatch(setForbidden({ forbidden: false }));
    _history.push('/');
  }, []);

  return (
    <Result
      status={'403'}
      title={t('无权限')}
      subTitle={t('对不起，你没有本项目的查看权限')}
      extra={<Button onClick={handleBackToHome} type={'primary'}>{t('返回主页')}</Button>}
    />
  );
}

export default Forbidden;
