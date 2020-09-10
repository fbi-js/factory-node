import request from '../utils/request';

export const routerList = query => {
    return request({
        url: '/router/list',
        method: 'get',
       // params: query
    });
};

export const routerAdd = data=> {
    return request({
        url: '/router/add/'+data.name,
        method: 'get',
        params:data
    });
};

export const routerRemove = name => {
    return request({
        url: '/router/remove',
        method: 'delete',
        params:{name:name}
    });
};

