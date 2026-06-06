const sequelize = require("../config/db");
const Sequelize = require("sequelize");
const moment = require("moment");

//   prop:'name', 'age','sexlabel','birth','addr'

const user = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(255),
    },
    age: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    sex: Sequelize.STRING,
    birth: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        return moment(this.getDataValue("birth")).format("YYYY-MM-DD HH:mm");
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        return moment(this.getDataValue("createdAt")).format(
          "YYYY-MM-DD HH:mm",
        );
      },
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      get() {
        return moment(this.getDataValue("updatedAt")).format(
          "YYYY-MM-DD HH:mm",
        );
      },
    },
    addr: Sequelize.STRING, // 地址字段，使用字符串类型
  },
  {
    freezeTableName: true, // 禁止 Sequelize 自动将表名转换为复数形式
  },
);

module.exports = user;
