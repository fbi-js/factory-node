import { verify } from 'jsonwebtoken'
import { Context } from '../context'

export * from './arg-types'

interface Token {
  userId: string
}

export function getUserId(context: Context) {
  const Authorization = context.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const verifiedToken = verify(token, process.env.AUTH_SECRET as string) as Token
    return verifiedToken && verifiedToken.userId
  }
}
