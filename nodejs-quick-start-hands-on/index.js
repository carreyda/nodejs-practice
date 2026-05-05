const Koa = require("koa");

const app = new Koa();

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

app.listen(3002, () => {
  console.log("Server is running on http://localhost:3002");
});
