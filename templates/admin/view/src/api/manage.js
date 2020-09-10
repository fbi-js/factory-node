import request from '../utils/request';

export const manageList = query => {
    return request({
        url: '/tenant/list',
        method: 'get',
       params: query
    });
};

export const manageAdd = data => {
    return request({
        url: 'tenant/add',
        method: 'post',
        data
       // params: query
    });
};

export const manageUpdate = data => {
    return request({
        url: 'tenant/update',
        method: 'post',
        data
       // params: query
    });
};

export const manageDelete = name => {
    return request({
        url: 'tenant/delete',
        method: 'GET',
        params: name
    });
};