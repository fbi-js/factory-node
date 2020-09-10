
import * as fs from 'fs'
import { runShell } from '@mrapi/common'
import dalServer from '../dal'
const net = require('net')
export const GetRouters= function(){
   if(!dalServer.dal.server||!dalServer.dal.server.app._router){
       return []
   }
  const routes = dalServer.dal.server.app._router.stack
            const list = []
            for (const item of routes) {
               if(item.name=="graphqlMiddleware"){
                list.push({
                    name: item.name,
                    path: item.path,
                    regexp: item.regexp
                })
              }
            }
            return list
}
export const GetPrismaClientName = async function() {
    let files: string[] = []
    try{
     files = await fs.readdirSync('node_modules/.prisma-mrapi')
    }catch(err) {

    }
    return files
}

export const CheckProcess = async function(port:number) {
    try{
    const res = await runShell(`lsof -i:${port}`)
    console.log('lsof -i -->  used:',res)
     return true
    }catch(err) {
      console.log('lsof -i --> no use:',err)
      return false
    }
}

export const CheckTenantManagement = async function() {
     try{
       require('.prisma-multi-tenant/management')
       return true
     }catch(err) {
       return false
     }
}
/**
 *检查端口是否被占用
 * @param port
 */
export const portInUse = async function (port:Number) {
  return await new Promise((resolve) => {
     try {
      const server = net.createServer().listen(port)
      server.on('listening',function() {
        console.log(port,'未被占用')
          server.close()
          resolve(false)
      })
      server.on('error',function(err:any) {
        console.log(port,'占用')
          if(err.code == 'EADDRINUSE') {
            resolve(true)
          }
      })
    } catch (error) {
      console.log(333)
    }
  })
}
