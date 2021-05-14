import { API } from '../config';

class Account extends API {
  static PREFIX = '/abs/account';

  aliPayLogin = Account.sign({
      url: '/inc/alipayLogin',
      method: 'post'
  });
}

export default new Account();
