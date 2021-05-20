import { API } from '../config';

class Login extends API {
  static PREFIX = '/abs/account';

  getVerificationCode = Login.sign({
    method: 'get',
    url: '/inc/getVerificationCode'
  });

  register = Login.sign({
    url: '/inc/register',
    method: 'post'
  });

  accountLogin = Login.sign({
    url: '/inc/accountLogin',
    method: 'post'
  });

  getLoginInfo = Login.sign({
    url: '/inc/getLoginInfo',
    method: 'get'
  });

  logout = Login.sign({
    url: '/inc/logout',
    method: 'post'
  });
}

export default new Login();
