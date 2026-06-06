# Node.js Koa2 后端项目

一个基于 Node.js + Koa2 的 RESTful API 后端服务，集成 Sequelize ORM 和 MySQL 数据库，提供用户管理相关接口。

---

## 技术栈

| 技术 | 说明 |
|------|------|
| **运行时** | Node.js |
| **Web 框架** | [Koa2](https://github.com/koajs/koa) ^2.7.0 |
| **ORM** | [Sequelize](https://sequelize.org/) ^6.37.8 |
| **数据库** | MySQL（mysql2 驱动） |
| **模板引擎** | Pug ^2.0.3 |
| **日志** | log4js ^6.9.1 |
| **日期处理** | moment ^2.30.1 |
| **进程管理** | pm2（生产环境） |
| **开发工具** | nodemon（开发环境热重载） |

---

## 目录结构

```
server/
├── app.js                  # Koa 应用入口，中间件注册和路由挂载
├── bin/
│   └── www                 # HTTP 服务器启动脚本（端口监听）
├── config/
│   └── db.js               # Sequelize 数据库连接配置
├── controller/
│   └── user.js             # 用户控制器（业务逻辑层）
├── model/
│   └── user.js             # User 模型定义（数据表映射）
├── routes/
│   ├── index.js            # 根路由（首页、测试接口）
│   └── users.js            # 用户路由（RESTful API 路由定义）
├── utils/
│   └── log4.js             # log4js 日志工具配置
├── views/                  # Pug 模板文件
│   ├── layout.pug
│   ├── index.pug
│   └── error.pug
├── public/                 # 静态资源目录
│   └── stylesheets/
│       └── style.css
├── logs/                   # 日志输出目录（自动生成）
├── package.json
└── .gitignore
```

---

## 快速开始

### 环境要求

- Node.js（建议 v12+）
- MySQL 数据库

### 安装步骤

```bash
# 1. 进入项目目录
cd server

# 2. 安装依赖
npm install

# 3. 配置数据库
#    编辑 config/db.js，修改为你的数据库连接信息

# 4. 启动服务
npm run dev     # 开发模式（nodemon 自动重启）
```

### 启动方式

```bash
# 开发模式（nodemon，代码变更自动重启）
npm run dev

# 生产模式（直接启动）
npm start

# 生产模式（pm2 进程管理）
npm run prd
```

服务默认运行在 **http://localhost:3000**。

---

## 数据库配置

编辑 [config/db.js](config/db.js) 修改数据库连接参数：

```javascript
const sequelize = new Sequelize("koadev", "root", "your_password", {
  host: "localhost",
  dialect: "mysql",
  // ...
});
```

配置项说明：

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `database` | 数据库名称 | `koadev` |
| `username` | 数据库用户名 | `root` |
| `password` | 数据库密码 | （需自行填写） |
| `host` | 数据库主机地址 | `localhost` |
| `dialect` | 数据库类型 | `mysql` |
| `pool.max` | 连接池最大连接数 | `5` |
| `pool.min` | 连接池最小连接数 | `0` |
| `pool.acquire` | 连接超时时间（毫秒） | `30000` |
| `pool.idle` | 空闲连接超时时间（毫秒） | `10000` |

**注意**：项目启动时 `sequelize.sync()` 会自动根据模型定义创建数据库表，无需手动建表。

---

## API 接口文档

### 基础路径

```
http://localhost:3000
```

### 1. 首页

```
GET /
```

返回首页 HTML 页面。

### 2. 测试接口

```
GET /string    → 返回纯文本 "koa2 string"
GET /json      → 返回 JSON  { title: "koa2 json" }
```

### 3. 查询用户列表（分页 + 模糊搜索）

```
GET /user
```

**请求参数（URL Query）**：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | Number | 否 | 1 | 当前页码 |
| pagesize | Number | 否 | 10 | 每页记录数 |
| name | String | 否 | "" | 用户名称（模糊搜索） |

**成功响应示例**：

```json
{
  "code": 200,
  "total": 100,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "张三",
        "age": 25,
        "sex": "男",
        "birth": "2026-06-06 12:00",
        "createdAt": "2026-06-06 12:00",
        "updatedAt": "2026-06-06 12:00",
        "addr": "北京市"
      }
    ],
    "count": 100
  },
  "page": 1,
  "pagesize": 10,
  "msg": "success"
}
```

**错误响应示例**：

```json
{
  "code": 300,
  "data": "错误字段值 + 错误信息"
}
```

### 4. 创建用户

```
POST /user/addUser
```

**请求头**：`Content-Type: application/json`

**请求体（JSON）**：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| name | String | **是** | - | 用户名称 |
| age | Number | 否 | 0 | 用户年龄 |
| sex | String | 否 | - | 用户性别 |
| birth | Date | 否 | 当前时间 | 出生日期 |
| addr | String | 否 | - | 地址 |

**请求示例**：

```json
{
  "name": "李四",
  "age": 30,
  "sex": "男",
  "addr": "上海市"
}
```

**成功响应**：

```json
{
  "code": 200,
  "data": "创建成功"
}
```

**错误响应**：

```json
{
  "code": 300,
  "data": "错误值 + 错误信息"
}
```

---

## 项目架构

采用经典的三层架构：

```
HTTP 请求
    ↓
路由层（routes/）
    ├── 解析 URL、匹配路由
    ├── 将请求分发给对应的控制器方法
    ↓
控制层（controller/）
    ├── 参数校验和提取
    ├── 调用模型层进行数据操作
    ├── 组装响应数据（JSON 格式）
    ↓
模型层（model/）
    ├── 定义数据表结构（字段、约束、默认值）
    ├── 封装数据库查询方法
    ├── 通过 Sequelize ORM 与 MySQL 交互
    ↓
MySQL 数据库
```

### 请求处理流程

```
客户端请求
    ↓
Koa 中间件链（洋葱模型）
  ├── koa-bodyparser     → 解析请求体
  ├── koa-json           → JSON 格式化
  ├── koa-logger         → HTTP 请求日志
  ├── koa-static         → 静态资源服务
  ├── koa-views          → 模板渲染
  └── 路由中间件           → 分发到控制器
    ↓
控制器处理业务逻辑
    ↓
模型执行数据库操作
    ↓
响应返回客户端
```

---

## 日志

使用 log4js 进行日志管理，配置文件见 [utils/log4.js](utils/log4.js)。

**日志级别与输出**：

| 级别 | 控制台 | 文件 |
|------|--------|------|
| debug | ✅ | ❌ |
| info | ✅ | `logs/all-logs.log` |
| error | ❌ | `logs/error-logs.log.yyyy-MM-dd.log`（按日期滚动） |

```javascript
const logger = require("../utils/log4");
logger.info("这是一条 info 日志");
logger.error("这是一条 error 日志");
```

---

## 开发指南

### 添加新功能（三步法）

以添加"文章"功能为例：

**1. 定义模型** [model/article.js](model/article.js)

```javascript
const sequelize = require("../config/db");
const Sequelize = require("sequelize");

const article = sequelize.define("article", {
  title: { type: Sequelize.STRING, allowNull: false },
  content: { type: Sequelize.TEXT },
  // ...
});

module.exports = article;
```

**2. 创建控制器** [controller/article.js](controller/article.js)

```javascript
const Article = require("../model/article");

const list = async (ctx) => {
  const result = await Article.findAll();
  ctx.body = { code: 200, data: result };
};

module.exports = { list };
```

**3. 注册路由** [routes/article.js](routes/article.js)

```javascript
const router = require("koa-router")();
const Article = require("../controller/article");
router.prefix("/article");
router.get("/", Article.list);
module.exports = router;
```

最后在 [app.js](app.js) 中挂载路由：

```javascript
const article = require("./routes/article");
app.use(article.routes(), article.allowedMethods());
```

---

## Git 提交规范

本项目使用以下提交类型前缀：

| 前缀 | 说明 |
|------|------|
| `feat:` | 新功能 |
| `fix:` | 修复 Bug |
| `chore:` | 构建过程或辅助工具变动 |
| `docs:` | 文档更新 |
| `refactor:` | 代码重构 |
| `test:` | 测试相关 |

示例：

```
feat: 添加用户登录接口
fix: 修复分页查询总数不准确的问题
chore: 更新依赖版本
```

---

## 常见问题

### 1. 数据库连接失败

- 确认 MySQL 服务已启动
- 检查 `config/db.js` 中的用户名、密码、数据库名是否正确
- 确认数据库 `koadev` 已创建：`CREATE DATABASE koadev;`

### 2. 端口被占用

修改 [bin/www](bin/www) 中的端口配置，或设置环境变量：

```bash
set PORT=3001    # Windows
export PORT=3001 # Linux / macOS
```

### 3. 表没有自动创建

`config/db.js` 中的 `sequelize.sync()` 在模型定义变更时不会更新已有表结构。如需重新建表，可暂时修改为：

```javascript
sequelize.sync({ force: true });
```

**注意**：`force: true` 会先删除已有表再重建，**生产环境禁止使用**。
