/**
 * MySQL healthcheck
 */
const mysql = require("mysql2/promise");
const logger = require("../logger");

async function healthcheck(dbConfig) {
  logger.info("MySQL healthcheck started ");

  let conn;
  try {
    conn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      connectTimeout: dbConfig.timeout,
      debug: dbConfig.debug,
    });
    await conn.query("SELECT 1 as val");
    return { status: "SUCCESS" };
  } catch (err) {
    logger.error("MySQL healthcheck failed", err);
    return { status: "FAILURE", error: err };
  } finally {
    logger.info("MySQL healthcheck ended ");
    if (conn) {
      await conn.release();
    }
  }
}

function loadConfig(database) {
  return Object.assign(database, {
    host: process.env.DB_HOST || "undefined",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "undefined",
    password: process.env.DB_PASSWORD || "undefined",
  });
}

exports.healthcheck = healthcheck;
exports.loadConfig = loadConfig;
