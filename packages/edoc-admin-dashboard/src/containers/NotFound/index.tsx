import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Button, Result } from 'antd';

interface IProps { }

function NotFound(props: IProps) {
  const { t } = useTranslation();
  const _history = useHistory();

  const handleBackToHome = React.useCallback(() => {
    _history.replace(PREFIX);
  }, []);

  return (
    <Result
      status={'404'}
      title={'404'}
      subTitle={t('对不起，该页面不存在')}
      extra={<Button onClick={handleBackToHome} type={'primary'}>{t('返回主页')}</Button>}
    />
  );
}

export default NotFound;
