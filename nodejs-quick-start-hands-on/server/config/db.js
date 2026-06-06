const Sequelize = require("sequelize"); // 引入 Sequelize 模块

const sequelize = new Sequelize("koadev", "root", "GHzd24493.", {
  host: "localhost", // 数据库主机地址
  dialect: "mysql", // 数据库类型，这里使用 MySQL
  operatorAliases: true, // 允许使用字符串操作符别名
  pool: {
    max: 5, // 连接池最大连接数
    min: 0, // 连接池最小连接数
    acquire: 30000, // 连接池获取连接的最大等待时间（毫秒）
    idle: 10000, // 连接池中连接的最大空闲时间（毫秒）
  },
});

Sequelize.authenticate()
  .then(() => {
    console.log("数据库连接成功！");
  })
  .catch((err) => {
    console.error("数据库连接失败：", err);
  });

// 根据模型自动创建表
sequelize.sync();

module.exports = sequelize; // 导出 Sequelize 实例，以便在其他文件中使用
