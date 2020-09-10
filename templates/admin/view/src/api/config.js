import request from '../utils/request';

export const configInfo = query => {
    return request({
        url: '/config/info',
        method: 'get',
       // params: query
    });
};

export const configInit = data => {
    return request({
        url: '/config/init',
        method: 'post',
        data
    });
};