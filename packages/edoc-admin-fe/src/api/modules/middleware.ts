import { API } from '../config';

class Middleware extends API {
  static PREFIX = '/abs/middleware';

  uploadImage = Middleware.sign({
    url: '/uploadImage',
    static: true,
  });
}

export default new Middleware();
