import React from 'react';
import { useTranslation } from 'react-i18next';

import { ConfigApi } from '@/api';

import { Modal, Spin, message, Empty } from 'antd';
import HighLightCodeBlock from '@/components/HighLightCodeBlock';

import palenight from 'prism-react-renderer/themes/palenight/index.js';

import './index.scss';

// const prismReactRendererThemes: { [k: string]: any } = {};
// const prismReactRendererThemesModuleContext = require.context('prism-react-renderer/themes', true, /index\.js/);

// prismReactRendererThemesModuleContext.keys().forEach(fileName => {
//   const modeName = fileName.split(/^\.\/(\w+)\/index\.js$/)[1];
//   const modeFile = fileName.split(/^\.\/(.+)$/)[1];

//   const { default: modeModuleESDefault } = require(`prism-react-renderer/themes/${modeFile}`);
//   prismReactRendererThemes[modeName] = modeModuleESDefault;
// });

// const prismReactRendererThemesKeys = Object.keys(prismReactRendererThemes);

interface IProps {
  visible: boolean;
  onCancel: () => void;
  version: string;
}

function TextPreviewModal(props: IProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [texts, setTexts] = React.useState<string>('');

  const [themeIndex, setThemeIndex] = React.useState<number>(0);

  const { t } = useTranslation();

  const loadData = React.useCallback(async (version: string) => {
    try {
      setLoading(true);
      const { data } = await ConfigApi.getByVersion({ version });
      setTexts(data || '');
    } catch (err) {
      message.error(err.message || JSON.stringify(err));
      message.error(t('获取文案失败'));
      setTexts('');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!!props.version) {
      loadData(props.version);
    } else {
      setTexts('');
    }
  }, [props.version]);

  // window.next = function () {
  //   const nextThemeIndex = (themeIndex + 1) % prismReactRendererThemesKeys.length;
  //   console.log(`Now theme is: ${prismReactRendererThemesKeys[nextThemeIndex]} ${nextThemeIndex + 1}/${prismReactRendererThemesKeys.length}`);
  //   setThemeIndex(nextThemeIndex);
  // }

  // React.useEffect(() => {
  //   console.log(`Now theme is: ${prismReactRendererThemesKeys[themeIndex]} 1/${prismReactRendererThemesKeys.length}`);
  // }, []);

  return (
    <Modal
      visible={props.visible}
      onCancel={props.onCancel}
      okButtonProps={{ style: { display: 'none' } }}
      cancelText={t('退出')}
      width={800}
      className={'text-preview-modal'}
      closable={false}
    >
      <Spin spinning={loading}>
        {!!texts ? (
          <HighLightCodeBlock
            style={{ padding: 20 }}
            // theme={prismReactRendererThemes[prismReactRendererThemesKeys[themeIndex]]}
            theme={palenight}
            language={'markdown'}
            className={'text-preview-modal-content'}
          >
            {texts}
          </HighLightCodeBlock>
        ) : (
          <Empty
            image={'https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'}
            imageStyle={{
              height: 60,
            }}
            description={loading ? t('加载中') : t('暂无数据')}
          />
        )}
      </Spin>
    </Modal>
  );
}

export default TextPreviewModal;
