# Node中间层模板

## 使用

- Install Dependencies

  ```bash
  yarn # or npm install
  ```

- Start Dev Server

  ```bash
  npm run dev
  ```

- Build for production

  ```bash
  npm run build
  ```

- Start for production

  ```bash
  npm run start
  ```


## 基础能力
- 代理openapi(config/index.js)
- 自定义接口(src/routes/serverTime)
- 统一中间件处理(src/middlewares/log)
- 修改proxy header(src/middlewares/log)
- 通过配置的service name调用请求(src/routes/serverTime)

## 目录结构
```bash
project
├── config(配置文件)
│   └── index.js
├── src
│   ├── helpers(工具函数)
│   │   ├── xx.ts
│   │   └── initProxy.ts
│   ├── middlewares(中间件)
│   │   ├── index.ts
│   │   ├── xx.ts
│   │   └── log.ts
│   ├── routes(自定义接口)
│   │   ├── index.ts
│   │   ├── xx.ts
│   │   └── serverTimes.ts
│   ├── app.ts
│   └── types.ts
├── README.md
├── package.json
├── tsconfig.json
└── Dockerfile
```