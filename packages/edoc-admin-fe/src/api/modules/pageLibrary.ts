import { API } from '../config';

class PageLibrary extends API {
  static PREFIX = '/abs/page';

  usePageLibraryList = PageLibrary.sign({
    url: '/limitGet',
    useHooks: true,
    method: 'post'
  });

  getPageLibraryByID = PageLibrary.sign({
    url: '/getById',
  });

  useAllPageLibraryBySiteID = PageLibrary.sign({
    url: '/getAll',
    method: 'post',
    useHooks: true
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
