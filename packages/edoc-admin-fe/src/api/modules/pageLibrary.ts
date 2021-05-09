import { API } from '../config';

class PageLibrary extends API {
  static PREFIX = '/abs/page';

  usePageLibraryList = PageLibrary.sign({
    url: '/limitGet',
    useHooks: true,
    method: 'post'
  });

  getPageLibraryByID = PageLibrary.sign({
    url: '/getPageLibraryByID',
  });

  createPageLibrary = PageLibrary.sign({
    url: '/add',
    method: 'post'
  });

  deletePageLibrary = PageLibrary.sign({
    url: '/delete',
    method: 'delete'
  });
}

export default new PageLibrary();
