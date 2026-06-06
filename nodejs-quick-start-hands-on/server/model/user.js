/**
 * User 模型文件
 *
 * 定义用户数据表的结构和字段映射关系。
 * 使用 Sequelize ORM 框架定义模型，自动与 MySQL 数据库中的 user 表同步。
 *
 * @module model/user
 */

// 导入 Sequelize 实例（已建立连接的数据库连接对象）
const sequelize = require("../config/db");
// 导入 Sequelize 库本身，用于使用其数据类型（INTEGER, STRING, DATE 等）
const Sequelize = require("sequelize");
// 导入 moment.js 日期处理库，用于对日期字段进行格式化输出
const moment = require("moment");

/**
 * 定义 User 模型
 *
 * sequelize.define(modelName, attributes, options)
 *   - modelName: 模型名称（字符串），Sequelize 默认会根据该名称自动推断数据库表名
 *   - attributes: 对象，定义模型包含的所有字段及其约束
 *   - options: 对象，额外的模型配置选项
 */
const user = sequelize.define(
  /*
   * 第一个参数：模型名称
   * 由于下方配置了 freezeTableName: true，Sequelize 不会对其做复数化处理，
   * 因此数据库中的表名与模型名称保持一致，即 "user"。
   */
  "user",

  /*
   * 第二个参数：字段定义（attributes）
   * 对象的每个键对应数据库表中的一个列名，
   * 值定义了该列的数据类型、约束、默认值、Getter/Setter 等。
   */
  {
    // 主键 ID，自动递增
    id: {
      type: Sequelize.INTEGER(11), // 数据类型：整数，长度为 11
      primaryKey: true, // 标记为该表的主键
      autoIncrement: true, // 开启自增，插入新记录时自动生成
    },

    // 用户名称
    name: {
      allowNull: false, // 不允许为空（NOT NULL 约束）
      type: Sequelize.STRING(255), // 数据类型：可变长字符串，最大长度 255
    },

    // 用户年龄
    age: {
      type: Sequelize.INTEGER, // 数据类型：整数
      defaultValue: 0, // 默认值为 0（插入数据时若未指定则自动填充）
    },

    // 用户性别（简写形式：直接指定数据类型，不附加其他配置）
    sex: Sequelize.STRING,

    // 出生日期
    birth: {
      type: Sequelize.DATE, // 数据类型：日期时间
      defaultValue: Sequelize.NOW, // 默认值为当前时间（插入时的数据库时间）
      /**
       * Getter 方法 —— 读取该字段时自动触发
       *
       * 使用 moment.js 将原始的 Date 对象格式化为 "YYYY-MM-DD HH:mm" 格式的字符串，
       * 这样业务层读取到的 birth 字段值就是格式化后的可读字符串，而非原始的 Date 对象。
       *
       * this.getDataValue("birth") —— 获取数据库中存储的原始值（绕过 getter 避免递归）
       */
      get() {
        return moment(this.getDataValue("birth")).format("YYYY-MM-DD HH:mm");
      },
    },

    // 记录创建时间（Sequelize 约定字段）
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      /**
       * Getter 方法，将原始的 Date 对象格式化为 "YYYY-MM-DD HH:mm" 字符串
       */
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "YYYY-MM-DD HH:mm",
        );
      },
    },

    // 记录更新时间（Sequelize 约定字段）
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      /**
       * Getter 方法，将原始的 Date 对象格式化为 "YYYY-MM-DD HH:mm" 字符串
       */
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm",
        );
      },
    },

    // 地址字段（简写形式）
    addr: Sequelize.STRING,
  },

  /*
   * 第三个参数：模型配置选项（options）
   */
  {
    /**
     * freezeTableName: true
     *
     * 默认情况下，Sequelize 会自动将模型名称转换为复数形式作为数据库表名。
     * 例如模型名为 "user"，则默认表名为 "users"。
     *
     * 设置 freezeTableName: true 可以禁止这种行为，
     * 使数据库表名与模型名完全一致，即 "user" 而非 "users"。
     */
    freezeTableName: true,
  },
);

// 导出 User 模型，供控制层（Controller）或其他模块调用
module.exports = user;
