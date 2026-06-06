/**
 * User 控制器
 *
 * 处理与用户相关的 HTTP 请求，调用 User 模型完成数据库操作，
 * 并结构化返回 JSON 格式的响应数据。
 *
 * 使用 Koa2 的上下文对象（ctx）接收请求参数和发送响应。
 *
 * @module controller/user
 */

// 导入 User 模型，提供对 user 表的增删改查方法
const User = require("../model/user");
// 从 Sequelize 中解构出 Op 对象，用于构建复杂的查询条件（如模糊匹配、比较运算等）
const Op = require("sequelize").Op;

/**
 * 查询用户列表（分页 + 模糊搜索）
 *
 * 接口说明：
 *   - 支持分页查询，通过 page（页码）和 pagesize（每页条数）控制
 *   - 支持按用户名称模糊搜索（name 参数）
 *   - 查询结果按 createdAt 字段降序排列（最新的记录在前）
 *   - 返回总记录数和当前页数据列表，便于前端渲染分页控件
 *
 * @async
 * @param {Object} ctx - Koa 上下文对象
 * @param {Object} ctx.query - URL 查询参数
 * @param {string} [ctx.query.page=1] - 当前页码，从 1 开始
 * @param {string} [ctx.query.pagesize=10] - 每页返回的记录条数
 * @param {string} [ctx.query.name=""] - 搜索关键词，按用户名称进行 LIKE 模糊匹配
 * @returns {Promise<void>} 无返回值，通过 ctx.body 返回 JSON 响应
 */
const listAll = async (ctx) => {
  // ---------- 1. 解析请求参数 ----------
  // 从 URL 查询字符串中读取 page 和 pagesize，转为整数类型；
  // 若未提供或转换失败，则使用默认值（page=1, pagesize=10）
  const page = parseInt(ctx.query.page) || 1;
  const pagesize = parseInt(ctx.query.pagesize) || 10;
  // 从查询字符串中读取 name 参数，若未提供则默认为空字符串
  const name = ctx.query.name || "";

  // ---------- 2. 计算 SQL 偏移量 ----------
  // Sequelize 的 offset 从 0 开始计数。
  // 例：page=1 时 offset=0（取前 pagesize 条），page=2 时 offset=pagesize（跳过第一页）
  const offset = (page - 1) * pagesize;

  // ---------- 3. 执行数据库查询 ----------
  try {
    /**
     * User.findAndCountAll() —— 同时返回分页数据和总记录数
     *
     * 这是 Sequelize 提供的便捷方法，底层对应：
     *   SELECT COUNT(*) ...          （总数，放入 result.count）
     *   SELECT * ... LIMIT ? OFFSET ?（当前页数据，放入 result.rows）
     *
     * 避免了开发者手动执行两次查询的麻烦。
     */
    const result = await User.findAndCountAll({
      // where：查询过滤条件
      where: {
        name: {
          // Op.like：SQL 中的 LIKE 操作符
          // `%${name}%` 表示包含 name 的模糊匹配
          // 例：name="张" → WHERE name LIKE '%张%'
          [Op.like]: `%${name}%`,
        },
      },
      // order：排序规则，[["字段名", "ASC|DESC"]]
      // 此处按 createdAt 字段降序排列，最新的用户排在前面
      order: [["createdAt", "DESC"]],
      // limit：每页最多返回的记录数（对应 SQL 的 LIMIT）
      limit: pagesize,
      // offset：跳过的记录数（对应 SQL 的 OFFSET）
      offset: offset,
    });

    // ---------- 4. 返回成功响应 ----------
    ctx.body = {
      code: 200, // 业务状态码：200 表示成功
      total: result.count, // 总记录数（用于前端分页组件计算总页数）
      data: {
        list: result.rows, // 当前页的数据列表（数组）
        count: result.count, // 冗余传递总数，便于前端直接使用
      },
      page, // 当前页码（回传给前端，方便状态同步）
      pagesize, // 每页条数（回传给前端）
      msg: "success", // 提示消息
    };
  } catch (error) {
    // ---------- 5. 异常处理 ----------
    // 当数据库查询失败或 Sequelize 校验不通过时进入此分支
    // error.errors 是 Sequelize 提供的验证错误数组，取第一个错误信息
    const msg = error.errors[0];
    ctx.body = {
      code: 300, // 业务状态码：300 表示业务处理失败
      // 将具体的错误值和错误消息拼接返回，便于前端定位问题
      data: msg.value + msg.message,
    };
  }
};

/**
 * 创建用户
 *
 * 接口说明：
 *   - 接收 POST 请求体中的 JSON 数据，创建一条新的用户记录
 *   - 请求体字段需与 User 模型定义的字段对应（name, age, sex, birth, addr 等）
 *   - 若模型字段设置了 defaultValue，未传入的字段会自动填充默认值
 *
 * @async
 * @param {Object} ctx - Koa 上下文对象
 * @param {Object} ctx.request.body - POST 请求体中的 JSON 数据
 * @returns {Promise<void>} 无返回值，通过 ctx.body 返回 JSON 响应
 */
const create = async (ctx) => {
  // ---------- 1. 获取请求参数 ----------
  // Koa 的 body 解析中间件（如 koa-bodyparser）会将 POST 请求体解析为对象
  // 赋值给 ctx.request.body
  const params = ctx.request.body;

  // ---------- 2. 执行数据库插入 ----------
  try {
    /**
     * User.create(params) —— 创建一条新记录
     *
     * Sequelize 会将 params 对象的键与模型字段一一映射，
     * 生成 INSERT INTO user (...) VALUES (...) SQL 语句并执行。
     *
     * 如果模型字段设置了 defaultValue 且 params 中未提供该字段的值，
     * Sequelize 会自动填入默认值。
     */
    await User.create(params);

    // ---------- 3. 返回成功响应 ----------
    ctx.body = {
      code: 200,
      data: "创建成功",
    };
  } catch (error) {
    // ---------- 4. 异常处理 ----------
    // 捕获插入过程中的错误，常见原因包括：
    //   - 必填字段（如 name 设置了 allowNull: false）未提供
    //   - 字段类型不匹配（如 age 传入字符串而非数字）
    //   - 数据库连接异常
    const msg = error.errors[0];
    ctx.body = {
      code: 300,
      data: msg.value + msg.message,
    };
  }
};

// 导出控制器方法，供路由层（Router）注册对应的 HTTP 路由
// 使用解构导入方式：const { listAll, create } = require("../controller/user");
module.exports = {
  listAll,
  create,
};
