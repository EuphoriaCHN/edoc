import request from './request';

export const GetProjectByID = request('abs/project/getById');
export const GetBusinesses = request('abs/page/getAll', 'POST');
export const GetDocuments = request('abs/doc/getDocTreeByOwnerPageId');
export const GetDocumentContent = request('abs/doc/getDeployedContentByDocId');