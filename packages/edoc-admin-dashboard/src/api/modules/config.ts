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

    // 耗时
    getCastTime = ConfigApi.sign({
        url: '/getCastTime',
        method: 'get'
    });

    // 总任务量
    getTaskNum = ConfigApi.sign({
        url: '/getTaskNum',
        method: 'get'
    });

    // 已经调度任务量
    getCalledTaskNum = ConfigApi.sign({
        url: '/getCalledTaskNum',
        method: 'get'
    });

    // 未调度任务量
    getNotCalledTaskNum = ConfigApi.sign({
        url: '/getNotCalledTaskNum',
        method: 'get'
    });

    // 完成任务占比
    getProportion = ConfigApi.sign({
        url: '/getProportion',
        method: 'get'
    });

}

export default new ConfigApi();
