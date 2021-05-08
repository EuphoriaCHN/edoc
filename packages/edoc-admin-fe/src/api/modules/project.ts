import { API } from '../config';

class Project extends API {
  static PREFIX = '/abs/project';

  useProjectList = Project.sign({
    url: '/limitGet',
    useHooks: true,
    method: 'post'
  });

  getProjectByID = Project.sign({
    url: '/getProjectByID',
  });

  createProject = Project.sign({
    url: '/add',
    method: 'post'
  });
}

export default new Project();
