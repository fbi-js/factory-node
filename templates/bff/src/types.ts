import { HTTPMethod } from '@mrapi/router'
import type { app } from '@mrapi/app'
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
export interface CMeddileware {
  (req: app.Request, res: app.Response, next: app.Next): void
}

export { mrapi, app }
