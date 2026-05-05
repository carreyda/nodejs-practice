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

/* const Router = require("@koa/router");

const router = new Router();

router.get("/", async (ctx) => {
  console.log("Received a request：", ctx, ctx.request);
  ctx.body = "Hello World";
});

router.get("/api", async (ctx) => {
  console.log("Received a request：", ctx, ctx.request);
  ctx.body = "Hello Api";
});

app.use(router.routes()).use(router.allowedMethods()); */
