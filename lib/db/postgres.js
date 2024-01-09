/**
 * PostgreSQL healthcheck
 */
const pg = require("pg");
const logger = require("../logger");

async function healthcheck(dbConfig) {
  logger.info("PostgreSQL healthcheck started ");

  let conn;
  try {
    const client = new pg.Client({
      host: dbConfig.host,
      password: dbConfig.password,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      query_timeout: dbConfig.timeout,
      statement_timeout: dbConfig.timeout,
      connectionTimeoutMillis: dbConfig.timeout,
    });
    conn = await client.connect();
    await conn.query("SELECT 1 as val");
    return { status: "SUCCESS" };
  } catch (err) {
    logger.error("PostgreSQL healthcheck failed", err);
    return { status: "FAILURE", error: err };
  } finally {
    logger.info("PostgreSQL healthcheck ended ");
    if (conn) await conn.end();
  }
}

function loadConfig(database) {
  return Object.assign(database, {
    host: process.env.DB_HOST || "undefined",
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || "undefined",
    password: process.env.DB_PASSWORD || "undefined",
  });
}

exports.healthcheck = healthcheck;
exports.loadConfig = loadConfig;
