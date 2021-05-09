import { API } from '../config';

class DocumentAPI extends API {
  static PREFIX = '/abs/doc';

  /**
   * 根据页面库 ID，获取下面的文档树形结构
   */
  getDocumentList = DocumentAPI.sign({
    url: '/get',
    method: 'post'
  });

  createDocument = DocumentAPI.sign({
    method: 'post',
    url: '/add',
  });

  deleteDocument = DocumentAPI.sign({
    method: 'delete',
    url: '/delete'
  });
}

export default new DocumentAPI();
