import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Button, Carousel } from 'antd';

import CenteredImage from '@/components/CenteredImage';
import LoginDrawer from '@/components/LoginDrawer';

import './index.scss';

const landingPageCarouselImagesModules = require.context('../../common/images/LandingPageCarousel', true);

interface IProps {

}

function Login(props: any) {
  const [loginDrawerVisible, setLoginDrawerVisible] = React.useState<boolean>(false);
  const [carouselImages, setCarouselImages] = React.useState<string[]>([]);
  const { t } = useTranslation();

  React.useEffect(() => {
    const landingPageCarouselImages: Promise<string>[] = [];

    for (const name of landingPageCarouselImagesModules.keys()) {
      const fileName = name.replace(/^\.\//, '');

      landingPageCarouselImages.push(new Promise(resolve => {
        import(`@/common/images/LandingPageCarousel/${fileName}`).then(value => {
          resolve(value.default);
        });
      }));
    }

    Promise.all(landingPageCarouselImages).then(setCarouselImages);
  }, []);

  return (
    <React.Fragment>
      <div className={'login'}>
        <div className={'login-containers'}>
          <div className={'login-containers-title'}>
            <Typography.Title level={1}>Edoc</Typography.Title>
            <Typography.Paragraph>{t('0 成本，会打字就能建站')}</Typography.Paragraph>
            <Button type={'primary'} onClick={() => setLoginDrawerVisible(true)}>{t('登录 / 注册')}</Button>
          </div>
          <div>
            
          </div>
        </div>
        <div className={'login-waves'}>
          <svg
            className={'login-waves-container'}
            xmlns={'http://www.w3.org/2000/svg'}
            xmlnsXlink={'http://www.w3.org/1999/xlink'}
            viewBox={'0 24 150 28'}
            preserveAspectRatio={'none'}
            shapeRendering={'auto'}
          >
            <defs>
              <path id={'gentle-wave'} d={'M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z'} />
            </defs>
            <g className={'parallax'}>
              <use xlinkHref={'#gentle-wave'} x={'48'} y={'0'} fill={'rgba(255,255,255,0.7)'} />
              <use xlinkHref={'#gentle-wave'} x={'48'} y={'3'} fill={'rgba(255,255,255,0.5)'} />
              <use xlinkHref={'#gentle-wave'} x={'48'} y={'5'} fill={'rgba(255,255,255,0.3)'} />
              <use xlinkHref={'#gentle-wave'} x={'48'} y={'7'} fill={'#fff'} />
            </g>
          </svg>
        </div>
      </div>
      <LoginDrawer visible={loginDrawerVisible} onClose={() => setLoginDrawerVisible(false)} />
    </React.Fragment>
  )
}

export default Login;
