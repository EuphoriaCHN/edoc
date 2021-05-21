import { API } from '../config';

class ConfigApi extends API {
    static PREFIX = '/enhanceTimer';

    createTask = ConfigApi.sign({
        url: '/createTask',
        method: 'post'
    });
}

export default new ConfigApi();
