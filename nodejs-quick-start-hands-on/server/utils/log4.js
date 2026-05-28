const log4js = require("log4js");

// 日志级别映射，按严重程度从低到高排列
const levels = {
  trace: log4js.levels.TRACE, // 最详细的追踪日志，用于调试细粒度流程
  debug: log4js.levels.DEBUG, // 调试信息，开发阶段定位问题用
  info: log4js.levels.INFO, // 常规信息，记录程序正常运行状态
  warn: log4js.levels.WARN, // 警告，表示潜在问题但程序仍可运行
  error: log4js.levels.ERROR, // 错误，某个功能或请求执行失败
  fatal: log4js.levels.FATAL, // 致命错误，程序即将崩溃或已无法继续运行
};

// 配置 log4js
log4js.configure({
  appenders: {
    console: { type: "console" },
    // 所有日志输出到文件 logs/all-logs.log
    info: {
      type: "file",
      filename: "logs/all-logs.log",
    },
    // 错误日志输出到文件 logs/error-logs.log，并按日期分割（每天一个新文件）
    error: {
      type: "dateFile",
      filename: "logs/error-logs.log",
      pattern: "yyyy-MM-dd.log", // 日志文件名后缀格式，每天一个日志文件
      alwaysIncludePattern: true, // 始终在文件名中包含日期 pattern
    },
  }, // appenders 定义日志输出目标，这里配置控制台输出
  categories: {
    default: { appenders: ["console"], level: "debug" },
    info: { appenders: ["info"], level: "info" },
    error: { appenders: ["error"], level: "error" },
  }, // categories 定义日志类别：default 控制台输出 debug+级别，info 文件输出 info+级别，error 文件输出 error+级别
});

// 获取 logger 实例并设置日志级别，然后输出 debug 日志
exports.debug = (content) => {
  const logger = log4js.getLogger("debug");
  logger.level = levels.debug;
  logger.debug(content);
};

// 获取 logger 实例并设置日志级别，然后输出 info 日志
exports.info = (content) => {
  const logger = log4js.getLogger("info");
  logger.level = levels.info;
  logger.info(content);
};

// 获取 logger 实例并设置日志级别，然后输出 warn 日志
exports.warn = (content) => {
  const logger = log4js.getLogger("warn");
  logger.level = levels.warn;
  logger.warn(content);
};

// 获取 logger 实例并设置日志级别，然后输出 error 日志
exports.error = (content) => {
  const logger = log4js.getLogger("error");
  logger.level = levels.error;
  logger.error(content);
};

// 获取 logger 实例并设置日志级别，然后输出 fatal 日志
exports.fatal = (content) => {
  const logger = log4js.getLogger("fatal");
  logger.level = levels.fatal;
  logger.fatal(content);
};
