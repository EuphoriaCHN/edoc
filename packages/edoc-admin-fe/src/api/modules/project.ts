import { API } from '../config';

class Project extends API {
  static PREFIX = '/project';
  static MOCK_ALL = true;

  useProjectList = Project.sign({
    url: '/getProjectList',
    useHooks: true,
  });

  getProjectByID = Project.sign({
    url: '/getProjectByID',
  });
}

export default new Project();
