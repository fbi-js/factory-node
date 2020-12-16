# @fbi-js/factory-node

Templates and commands for node.js applications development.

> This is a factory for [fbi v4](https://github.com/fbi-js/fbi)

## Usage

```bash
npx fbi create factory-node
```

## Requirements

- `fbi v4+`
- `node v10+`

## Templates

- `app`: web application base on [@mrapi/app](https://github.com/mrapi-js/mrapi/blob/main/packages/app/README.md)
- `service`: API service base on [@mrapi/service](https://github.com/mrapi-js/mrapi/blob/main/packages/service/README.md)

  **Types**:

  - `Simple`: GraphQL/OpenAPI service using [@nexus/schema](https://github.com/graphql-nexus/schema)/[express-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi)
  - `Prisma`: GraphQL/OpenAPI service using [@nexus/schema](https://github.com/graphql-nexus/schema)/[express-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi) and [Prisma](https://github.com/prisma/prisma) (including DB process service)
  - `Aggregation`: GraphQL/OpenAPI aggregation service using [graphql-tools](https://github.com/ardatan/graphql-tools)
- `gateway`: API gateway base on [@mrapi/gateway](https://github.com/mrapi-js/mrapi/blob/main/packages/gateway/README.md)

## Features

- `Multiple modules`: One service can contain multiple modules, each module can have different endpoints, or can be merged by [GraphQL stitching](https://www.graphql-tools.com/docs/stitch-combining-schemas), [more info](https://github.com/mrapi-js/mrapi/blob/main/packages/service/README.md).
- `Multiple tenants`: [IBM Docs](https://www.ibm.com/cloud/learn/multi-tenant). [more info](https://github.com/mrapi-js/mrapi/blob/main/packages/datasource/README.md)

## Development

Build your own `factory-node` based on `@fbi-js/factory-node`,

```bash
# create a project
npx fbi create @fbi-js/factory-factory

npm i @fbi-js/factory-node
```

```ts
// src/index.ts

import FactoryNodeBase from '@fbi-js/factory-node'

import CommandX from './commands/my-command'
import TemplateX from './templates/my-template'

const { name, description } = require('../package.json')

export default class FactoryNode extends FactoryNodeBase {
  id = name
  description = description
  commands = [
    new CommandX(this),
  ]
  templates = [
    new TemplateX(this),
  ]
}
```

## Contribution

Please make sure to read the [Contributing Guide](./CONTRIBUTING.md) before making a pull request.

Thank you to all the people who already contributed to fbi factory!

## License

Licensed under [MIT](https://opensource.org/licenses/MIT).

