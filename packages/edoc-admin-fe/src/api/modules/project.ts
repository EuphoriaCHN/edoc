import { API } from '../config';

class Project extends API {
  static PREFIX = '/abs/project';

  useProjectList = Project.sign({
    url: '/limitGet',
    useHooks: true,
    method: 'post'
  });

  getProjectByID = Project.sign({
    url: '/getById',
  });

  createProject = Project.sign({
    url: '/add',
    method: 'post'
  });

  deleteProject = Project.sign({
    url: '/delete',
    method: 'delete'
  });
}

export default new Project();
