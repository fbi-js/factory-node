import DAL from '@mrapi/dal'
import type { DALOptions } from '@mrapi/dal/lib/types'

const options: DALOptions = [
  // {
  //   name: 'one',
  // },
]
 class DalServer {
  public dal: DAL
  public serverStatus:Boolean
  constructor() {
    this.dal = new DAL(options)
    this.serverStatus = false
  }
}
const dalServer = new DalServer()
export default dalServer
