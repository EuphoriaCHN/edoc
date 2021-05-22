import { API } from '../config';

class ConfigApi extends API {
    static PREFIX = '/enhanceTimer';

    createTask = ConfigApi.sign({
        url: '/createTask',
        method: 'post'
    });

    getTaskList = ConfigApi.sign({
        url: '/getTaskList',
        method: 'get'
    });

    getCpu = ConfigApi.sign({
        url: '/getCpu',
        method: 'get'
    });

    getMem = ConfigApi.sign({
        url: '/getMem',
        method: 'get'
    });

    getStorage = ConfigApi.sign({
        url: '/getStorage',
        method: 'get'
    });

    getByVersion = ConfigApi.sign({
        url: '/getByVersion',
        method: 'get'
    });

    getLog = ConfigApi.sign({
        url: '/getLog',
        method: 'get'
    });
}

export default new ConfigApi();
