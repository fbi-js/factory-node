import express from 'express'
import Recover from './Recover'
import assert from 'assert'
import { CheckTenantManagement } from '../Service/CommonService'
export default [
    // tenant 列表
    {
        method: 'GET',
        url: '/tenant/list',
        handler: Recover(async (req: express.Request) => {
            assert(await CheckTenantManagement(),'please init tenant')
            const name = req.query.schemaName
            console.log("----name",name)
            const PrismaClient = require('.prisma-multi-tenant/management').PrismaClient
            const prisma = new PrismaClient()
            if(name) {
              return prisma.tenant.findMany({ where: { schemaName: String(name) } })
            }else{
                return prisma.tenant.findMany()
            }
        }),
    },
    // create
    {
        method: 'POST',
        url: '/tenant/add',
        handler: Recover(async (req: express.Request) => {
            assert(req.body.name,'param [name]  can not be null')
            assert(req.body.url,'param [url]  can not be null')
            const PrismaClient = require('.prisma-multi-tenant/management').PrismaClient
            const prisma = new PrismaClient()

            const data = await prisma.tenant.findOne({ where: { name: req.body.name } })
            assert(!data,'name is exist')
            await prisma.tenant.create({ data: { name: req.body.name,url: req.body.url,schemaName: req.body.schemaName } })
            return 'ok'
        }),
    },
    // 更新 by  name
    {
        method: 'POST',
        url: '/tenant/update',
        handler: Recover(async (req: express.Request) => {
            assert(req.body.name,'param [name]  can not be null')
            assert(req.body.url,'param [url]  can not be null')
            const PrismaClient = require('.prisma-multi-tenant/management').PrismaClient
            const prisma = new PrismaClient()

            const data = await prisma.tenant.findOne({ where: { name: req.body.name } })
            assert(!data,'data is null')
            await prisma.tenant.update({ where: { name: req.body.name },data: { url: req.body.url } })
            return 'ok'
        }),
    },
    // 删除tenant
    {
        method: 'GET',
        url: '/tenant/delete',
        handler: Recover(async (req: express.Request) => {
            console.log(req.query.name)
            assert(req.query.name,'param [name]  can not be null')
            const PrismaClient = require('.prisma-multi-tenant/management').PrismaClient
            const prisma = new PrismaClient()
            await prisma.tenant.delete({ where: { name: req.query.name } })
            return 'ok'
        }),
    },

]
