import { API } from '../config';

class Account extends API {
  static PREFIX = '/abs/account';

  aliPayLogin = Account.sign({
    url: '/inc/alipayLogin',
    method: 'post'
  });

  updateInfo = Account.sign({
    url: '/updateInfo',
    method: 'post'
  });

  updatePassword = Account.sign({
    url: '/updatePassword',
    method: 'post'
  });

  updateAliPay = Account.sign({
    url: '/updateAlipay',
    method: 'post'
  });
}

export default new Account();
