
import ServerHandler from './ServerHandler'
import RouterHandler from './RouterHandler'
import SchemaHandler from './SchemaHandler'
import ManagementHandler from './ManagementHandler'
import ConfigHandler from './ConfigHandler'
export default[
    ...ServerHandler,
    ...RouterHandler,
    ...SchemaHandler,
    ...ManagementHandler,
    ...ConfigHandler,
]
