import { HTTPMethod } from '@mrapi/router'
import type { app } from '@mrapi/app'
import type { Gateway } from '@mrapi/gateway'
import type mrapi from '@mrapi/types'
import type { AxiosInstance } from 'axios'

export interface CRoute {
  url: string
  method: HTTPMethod
  handler: (req: app.Request, res: app.Response) => void
}

export interface CObj {
  [key: string]: any
}

export interface CApp extends Gateway {
  clients?: Clients
}

export interface Clients {
  [key: string]: AxiosInstance
}

export interface CMeddileware {
  (req: app.Request, res: app.Response, next: app.Next): void
}

export { mrapi, app }
