import { API } from '../config';

class PageLibrary extends API {
  static PREFIX = '/pageLibrary';
  static MOCK_ALL = true;

  usePageLibraryList = PageLibrary.sign({
    url: '/getPageLibraryBySiteID',
    useHooks: true
  });

  getPageLibraryByID = PageLibrary.sign({
    url: '/getPageLibraryByID',
  });
}

export default new PageLibrary();
