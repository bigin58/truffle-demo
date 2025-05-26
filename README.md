# truffle-demo

本项目为基于 Truffle 的以太坊智能合约开发与前端集成演示。

## 目录结构

- `contracts/`：智能合约源码目录
- `migrations/`：Truffle 部署脚本
- `test/`：合约测试脚本
- `build/`：Truffle 编译生成的合约 ABI 和字节码（已忽略）
- `web/`：前端项目，包含 DApp 前端代码
- `truffle-config.js`：Truffle 配置文件

## 使用说明

1. 安装依赖
   - 进入 `web/` 目录，执行 `pnpm install` 或 `npm install` 安装前端依赖
   - 根目录下可执行 `npm install -g truffle` 安装 Truffle

2. 编译与部署合约
   ```bash
   truffle compile
   truffle migrate
   ```

3. 启动前端项目
   ```bash
   cd web
   pnpm dev # 或 npm run dev
   ```

## 其他
- `build/` 和 `web/node_modules/` 已加入 .gitignore，不会提交到仓库。
- 如需自定义网络或配置，请修改 `truffle-config.js`。