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
