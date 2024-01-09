/**
 * MariaDB healthcheck
 */
const mariadb = require("mariadb");
const logger = require("../logger");

async function healthcheck(dbConfig) {
  logger.info("MariaDB healthcheck started ");

  let conn;
  try {
    const pool = mariadb.createPool({
      acquireTimeout: dbConfig.timeout,
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      connectionLimit: 1,
    });
    conn = await pool.getConnection();
    await conn.query("SELECT 1 as val");
    return { status: "SUCCESS" };
  } catch (err) {
    logger.error("MariaDB healthcheck failed", err);
    return { status: "FAILURE", error: err };
  } finally {
    logger.info("MariaDB healthcheck ended ");
    if (conn) {
      conn.end();
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
