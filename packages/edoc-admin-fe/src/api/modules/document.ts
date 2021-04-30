import { API } from '../config';

class DocumentAPI extends API {
  static PREFIX = '/document';
  static MOCK_ALL = true;

  /**
   * 根据页面库 ID，获取下面的文档树形结构
   */
  useDocumentList = DocumentAPI.sign({
    url: '/getDocumentStructureByPageLibraryID',
    useHooks: true
  });
}

export default new DocumentAPI();
