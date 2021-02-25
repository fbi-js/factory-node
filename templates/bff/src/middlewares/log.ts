import { CMeddileware } from "../types"

export default <CMeddileware> async function (_req, _res, next) {
  console.log('before middleware')
  // modify proxy header
  Object.assign(_req.headers, {
    customHeader: 123
  })
  await next()
  console.log('after middleware')
}