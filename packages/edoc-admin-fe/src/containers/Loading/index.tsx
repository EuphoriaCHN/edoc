import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Logo from '@/common/images/Logo.png';

import './index.scss';

function Loading() {
  const { t } = useTranslation();

  const render = useMemo(() => (
    <div className={'loading'}>
      <img src={Logo} />
      <div className={'loading-text'}>{t('加载中...')}</div>
    </div>
  ), []);

  return render;
}

export default Loading;
