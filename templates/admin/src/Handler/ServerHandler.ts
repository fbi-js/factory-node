import Recover from './Recover'
import express from 'express'
import dalServer from '../dal'
import assert from 'assert'
import * as fs from 'fs'
import { GetPrismaClientName ,CheckTenantManagement }from '../Service/CommonService'
import { ServerOptions } from '@mrapi/dal/lib/types'
const serverInfo = require('../../config/mrapi.config.js')
export default[
    {
        method: 'GET',
        url: '/server/start',
        handler: Recover(async (req:express.Request) => {
             const options:ServerOptions = {
                 port: Number(req.query.port),
                 host: String(req.query.host),
                 tenantIdentity: String(req.query.tenantIdentity),
             }
           //  const checkRes = await CheckProcess(options.port)
             assert(!dalServer.serverStatus,'server is runnning')
           if(!dalServer.dal.server) {
             dalServer.dal.start(options)
             const arr = await GetPrismaClientName()
             for(const item of arr) {
                dalServer.dal.addSchema(item)
             }
           }else{
             dalServer.dal.start(options)
          }
          dalServer.serverStatus = true
          serverInfo.default.serverInfo = options
          const str = JSON.stringify( serverInfo.default)
          await fs.writeFileSync('config/mrapi.config.js', `exports.default   = ${str}`, 'utf-8')
          return 'OK'
        }),
    },
    {
        method: 'GET',
        url: '/server/stop',
        handler: Recover(async () => {
            assert(dalServer.dal.server,'server is not exist')
           // assert(dal.server.serverRunningStatus,'server is stoped')
           dalServer.dal.server.stop()
           dalServer.serverStatus = false
            return 'OK'
        }),
    },
    {
        method: 'GET',
        url: '/server/info',
        handler: Recover(async () => {
             assert(await CheckTenantManagement(),'please init tenant')
             assert(dalServer.dal.server,'server is not exist，please start server')
            return { ...serverInfo.default.serverInfo,serverStatus: dalServer.serverStatus,tenantStatus: await CheckTenantManagement() }
        }),
    },
]
