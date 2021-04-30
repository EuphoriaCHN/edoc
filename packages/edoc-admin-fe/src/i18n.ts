import I18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export async function initI18nextInstance () {
  return new Promise(resolve => {
    I18n.use(initReactI18next).init({
      react: {
        useSuspense: false,
      },
      keySeparator: false,
      resources: {
        'zh': {},
        'en': {}
      },
      fallbackLng: ['zh', 'en'],
      lng: 'zh'
    }, resolve);
  });
}

export default I18n;
