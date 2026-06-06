/**
 * 用户路由模块
 *
 * 定义与用户相关的 HTTP 路由规则，将不同请求方法和路径映射到对应的控制器方法。
 * 使用 koa-router 中间件实现路由分发。
 *
 * 路由结构（基于 router.prefix 设置的公共前缀）：
 *   GET    /user       → 查询用户列表（分页 + 模糊搜索）
 *   POST   /user/addUser → 创建新用户
 *
 * @module routes/users
 */

// 1. 初始化 koa-router 实例
// require("koa-router")() —— 直接调用 koa-router 的构造函数创建一个新的路由实例
const router = require("koa-router")();

// 2. 导入用户控制器
// 控制器中封装了具体的业务逻辑，路由层只负责"分发"，不负责"处理"
const User = require("../controller/user");

// 3. 设置路由公共前缀
// router.prefix("/user") —— 为当前路由实例中所有已注册和即将注册的路由
// 统一添加 "/user" 前缀。
// 例如：router.get("/", ...) 实际匹配的路径为 GET /user
//        router.post("/addUser", ...) 实际匹配的路径为 POST /user/addUser
router.prefix("/user");

// 4. 注册具体路由

/**
 * GET /user
 *
 * 查询用户列表接口。
 * 委托给 User.listAll 控制器方法处理，支持分页和按名称模糊搜索。
 *
 * 请求参数（URL Query）：
 *   - page     (可选) 页码，默认 1
 *   - pagesize (可选) 每页条数，默认 10
 *   - name     (可选) 搜索关键词
 *
 * 响应格式：
 *   { code, total, data: { list, count }, page, pagesize, msg }
 */
router.get("/", User.listAll);

/**
 * POST /user/addUser
 *
 * 创建用户接口。
 * 委托给 User.create 控制器方法处理。
 *
 * 请求参数（Request Body - JSON）：
 *   - name  (必填) 用户名称
 *   - age   (可选) 年龄
 *   - sex   (可选) 性别
 *   - birth (可选) 出生日期
 *   - addr  (可选) 地址
 *
 * 响应格式：
 *   { code, data }
 */
router.post("/addUser", User.create);

// 5. 导出路由实例
// 导出的 router 需要在 app.js（或 index.js）中通过 app.use(router.routes()) 注册到 Koa 应用
module.exports = router;
