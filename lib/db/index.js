const mariadb_hc = require("./mariadb");
const logger = require("../logger");
const mysql_hc = require("./mysql");
const pgql_hc = require("./postgres");
const SUPPORTED_DB = require("../constants").SUPPORTED_DB;

/**
 * Select the healthcheck to run.
 * @param {*} dbType database type as a string
 * @returns null or the healtcheck implementation
 */
function loadHealthcheck(dbType) {
  // Load database type
  switch (dbType) {
    case SUPPORTED_DB.mariadb:
      return mariadb_hc;
    case SUPPORTED_DB.mysql:
      return mysql_hc;

    case SUPPORTED_DB.postgres:
      return pgql_hc;

    case SUPPORTED_DB.dynamodb:
      break;

    case SUPPORTED_DB.oracle:
      break;

    default:
      logger.error("Unknown database type : " + dbType + ".");
      break;
  }
  return undefined;
}

module.exports = loadHealthcheck;
