import express from 'express'
import handler from './Handler/index'
const server = require('../config/server')
const app = express()
app.use(express.json())
app.use(express.static('view_dist'))

for(const item of handler) {
    if(item.method.toUpperCase() === 'POST') {
            app.post(item.url, item.handler)
    }else if(item.method.toUpperCase() === 'GET') {
        app.get(item.url,item.handler)
    }
    else if(item.method.toUpperCase() === 'DELETE') {
        app.delete(item.url,item.handler)
    }
}
process.env.PMP_MANAGEMENT_URL = 'file:../config/db/management.db'
process.env.PMT_OUTPUT = `${process.env.PWD}/node_modules/.prisma-multi-tenant/management`
app.listen(server.listen.port)
console.info(`✅  admin playground  port: ${server.listen.port}`)
