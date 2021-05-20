declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

declare var AUTHORIZATION_KEY: 'Authorization';
declare var DEV_IP: 'http://192.168.28.24:21002';
declare var PROD_URL: 'http://abs.bhj-noshampoo.site';
declare var ONLINE_URL: 'http://edoc.bhj-noshampoo.site';
declare var I18N_COOKIE_KEY: 'locale';