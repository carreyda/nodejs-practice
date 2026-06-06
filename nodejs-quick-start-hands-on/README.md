学习地址：https://www.bilibili.com/video/BV12VovBSEGm

## 1.课程介绍

![image](https://img2024.cnblogs.com/blog/2332774/202605/2332774-20260502223649402-233377393.png)

## 2.koa简介

https://koajs.com/

**什么是Koa？**

Koa是一个新的web框架，致力于成为web应用和API开发领域中的一个更小、更富有表现力、更健壮的基石。

利用async函数丢弃回调函数，并增强错误处理。Koa没有任何预置的中间件，可快速而愉快地编写服务端应用程序。

> koa最主要的就是实现了http协议的处理

**Koa核心概念**

- Koa Application（应用程序）
- Context（上下文）
- Request（请求）、Response（响应）

![image](https://img2024.cnblogs.com/blog/2332774/202605/2332774-20260502230051919-2075065667.png)

安装：npm install koa -S

使用：

```js
const Koa = require("koa");

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

## 3.request和router基本使用

> npm i -S @koa/router

```js
const Router = require("@koa/router");

const router = new Router();

router.get("/", async (ctx) => {
  console.log("Received a request：", ctx, ctx.request);
  ctx.body = "Hello World";
});

router.get("/api", async (ctx) => {
  console.log("Received a request：", ctx, ctx.request);
  ctx.body = "Hello Api";
});

app.use(router.routes()).use(router.allowedMethods());
```

## 4.ctx与async的用法

![image](https://img2024.cnblogs.com/blog/2332774/202605/2332774-20260505235315788-2013064107.png)

```js
const Koa = require("koa");

const app = new Koa();

const middleware = function async(ctx, next) {
  console.log("this ismiddleware");
  console.log(ctx.request.path);
  //next(); // 这里需要调用 next() 来继续执行下一个中间件，否则请求会被挂起
};

const middleware1 = function async(ctx, next) {
  console.log("this ismiddleware1");
  console.log(ctx.request.path);
  next();
  console.log("this ismiddleware1 end");
};

const middleware2 = function async(ctx, next) {
  console.log("this ismiddleware2");
  console.log(ctx.request.path);
  next();
  console.log("this ismiddleware2 end");
};

app.use(middleware1);
app.use(middleware2);
app.use(middleware);

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});

// 打印结果：先进后出

/* 
this ismiddleware1
/
this ismiddleware2
/
this ismiddleware
/
this ismiddleware2 end
this ismiddleware1 end
*/
```

## 5.koa-generator快速生成koa服务的脚手架工具

1. npm install -g koa-generator
2. koa2 server
3. cd server
4. npm install
5. npm run start
6. npm run dev // 监视文件变化，自动重启服务，需要修改指令内容为："dev": "nodemon bin/www"

## 6.Mysql数据库的使用

- 登录 MySQL 数据库：mysql -u root -p
- 列出当前 MySQL 服务器上所有的数据库：show databases;
- 环境变量：Path->bin目录
- 创建数据库：create database koadev;

## 7.项目安装mysql以及sequelize

- npm install mysql -S
- npm install sequelize -S
- npm install mysql2 -S
