import express from 'express'
import Recover from './Recover'
import assert from 'assert'
import dalServer from '../dal'
export default [
    // 获取路由列表
    {
        method: 'GET',
        url: '/router/list',
        handler: Recover(async () => {
            assert(dalServer.dal.server,'server is not running')
            assert(dalServer.dal.server.app._router,'no routers')
            const routes = dalServer.dal.server.app._router.stack
            const list = []
            for (const item of routes) {
                list.push({
                    name: item.name,
                    path: item.path,
                    regexp: item.regexp.toString(),
                })
            }
            return list
        }),
    },
    {
        method: 'get',
        url: '/router/add/:name',
        handler: Recover(async (req: express.Request) => {
            assert(dalServer.dal.server,'start server first')
            assert(req.params.name,'params error')
            const name = req.params.name.split('.')[0]
            const openapi=req.query.openapi
            console.log("sssss",openapi)
            const routes = dalServer.dal.server.app._router.stack
            let isOk = false
            for (const item of routes) {
                    if(item.regexp.test(`/graphql/${name}`)) {
                        isOk = true
                        break
                    }
            }
            if(isOk) { // 更新路由
                dalServer.dal.removeSchema(name)
            }
            const tenant = req.query.tenant
           let  openAPI
            if(openapi=='true'){
              openAPI= {
                enable:true,
                options:{oasDir:`${process.cwd()}/node_modules/.prisma-mrapi/${name}/api`}
             }
            }else{
                openAPI= {
                    enable:false,
                 }
            }
            console.log(openAPI)
            if(tenant) {
                dalServer.dal.addSchema(name, {
                       defaultTenant: {
                         name: String(tenant),
                       },
                       openAPI
                     })
            }else{
                dalServer.dal.addSchema(name,
                    {
                        openAPI
                    }
                )
            }

            return 'ok'
        }),
    },
    {
        method: 'delete',
        url: '/router/remove',
        handler: Recover(async (req: express.Request) => {
            assert(req.query.name,'params error')
             const router=String(req.query.name)
             dalServer.dal.removeSchema(router.split('.')[0])
           return 'OK'
        }),
    },
]
