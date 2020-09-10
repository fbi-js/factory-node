import express from 'express'
import Recover from './Recover'
import * as fs from 'fs'
import assert from 'assert'
import { GetPrismaClientName ,GetRouters}from '../Service/CommonService'
import { spawnShell, runShell } from '@mrapi/common'
import dalServer from '../dal'
const  description = require( '../../config/prisma/description.json')
const multer = require('multer')
var upload = multer().single('file')
const uploadPromise = async (req: express.Request, res: express.Response) => {
    return await new Promise((resolve) => {
        upload(req, res, function () {
            // @ts-expect-error
            if (fs.existsSync(`config/prisma/${req.file.originalname}`)) {
                resolve({ code: 1, msg: 'file exist' })
                return
            }
            // @ts-expect-error
            fs.writeFile(`config/prisma/${req.file.originalname}`, req.file.buffer, (err) => {
                if (err) throw err
                // @ts-expect-error
                console.log(`config/prisma/${req.file.originalname} saved`)
            })
            resolve({ code: 0 })
        })
    })
}

export default [
    // schema 列表
    {
        method: 'GET',
        url: '/schema/list',
        handler: Recover(async () => {
            const files = await fs.readdirSync('config/prisma')
            assert(files.length > 0, 'do not exist .schema file')
            const arr = []
            const allClient = await GetPrismaClientName()
            const routers=GetRouters()
            
            for (const item of files) {
                if(!item.endsWith('.prisma')){
                   continue
                }
                const info = fs.statSync(`config/prisma/${item}`)
                const prefix = item.split('.')[0]
                let _router=false
                for(let i of routers){
                    if(i.regexp.test(`/graphql/${item.split('.')[0]}`)){
                        _router=true
                        break
                    }
                }
            
                arr.push({
                    name: item,
                    client: allClient.includes(prefix),
                    ctime: info.ctime,
                    mtime: info.mtime,
                    birthtime: info.birthtime,
                    size: info.size,
                    router:_router,
                    description:description[item]
                })
            }
            return arr.sort((a,b)=> b.mtime.getTime()-a.mtime.getTime())
        }),
    },
    // 获取某个schema的文件内容
    {
        method: 'GET',
        url: '/schema/get/:name',
        handler: Recover(async (req: express.Request) => {
            const content = await fs.readFileSync(`config/prisma/${req.params.name}`, 'utf-8')
            return content
        }),
    },
    // 更新某个schema 内容
    {
        method: 'POST',
        url: '/schema/update/:name',
        handler: Recover(async (req: express.Request) => {
            assert(fs.existsSync(`config/prisma/${req.params.name}`), 'file is not exist')

            await fs.writeFileSync(`config/prisma/${req.params.name}`, req.body.content, 'utf-8')
             description[req.params.name]=req.body.description
             await fs.writeFileSync(`config/prisma/description.json`, JSON.stringify(description), 'utf-8')
            return 'ok'
        }),
    },
    // 删除某个schema 内容
    {
        method: 'GET',
        url: '/schema/delete/:name',
        handler: Recover(async (req: express.Request) => {
           const clients = await GetPrismaClientName()
            assert(!clients.includes(req.params.name.split('.')[0]),'remove client first')
            assert(fs.existsSync(`config/prisma/${req.params.name}`), 'file is not exist')
            fs.unlinkSync(`config/prisma/${req.params.name}`)

            //删除租户
            const PrismaClient = require('.prisma-multi-tenant/management').PrismaClient
            const prisma = new PrismaClient()
            await prisma.tenant.deleteMany({where:{schemaName: String(req.params.name) }})
            
            return 'ok'
        }),
    },
    // 上传schema 文件
    {
        method: 'POST',
        url: '/schema/upload',
        // upload: upload.single('file'),
        handler: Recover(async (req: express.Request, res: express.Response) => {
            const r = await uploadPromise(req, res)
           // @ts-expect-error
            assert(r.code === 0,r.msg)
            return 'ok'
        }),
    },
    // 创建schema 文件
    {
        method: 'POST',
        url: '/schema/create/:name',
        handler: Recover(async (req: express.Request) => {
            assert(!fs.existsSync(`config/prisma/${req.params.name}`), 'file is exist')
            await fs.writeFileSync(`config/prisma/${req.params.name}`, req.body.content, 'utf-8')
            description[req.params.name]=req.body.description
            await fs.writeFileSync(`config/prisma/description.json`, JSON.stringify(description), 'utf-8')
           
            return 'ok'
        }),
    },
    // generate client
    {
        method: 'GET',
        url: '/schema/generate/:name',
        handler: Recover(async (req: express.Request) => {
            assert(req.params.name,'params error')
            const name = req.params.name.split('.')[0]
            try{
             const ress = await spawnShell(`npx mrapi generate --name ${name}`)
             assert(ress === 0,'generate failed')
            }catch(err) {
                assert(false,err)
            }
            return 'ok'
        }),
    },
     // delete client
     {
        method: 'GET',
        url: '/schema/remove_client/:name',
        handler: Recover(async (req: express.Request) => {
            assert(req.params.name,'params error')
            const name = req.params.name.split('.')[0]
            if(dalServer.dal.server) {
                // 先卸载路由
                console.log(`remove router ${name}`)
                dalServer.dal.server.removeRoute(name)
                dalServer.dal.removeSchema(name)
            }
            // 再删除client
            await runShell(`rm -rf node_modules/.prisma-mrapi/${name}`)

            await runShell(`rm -rf prisma/${name}.prisma`)
            return 'ok'
        }),
    },
]
