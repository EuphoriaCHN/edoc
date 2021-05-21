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
}

export default new ConfigApi();
