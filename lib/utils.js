var os = require("os");

const logger = require("./logger");
const loadHealthcheck = require("./db");
var netutils = require("./net");

var hostname = os.hostname();

const getHostname = () => {
  return hostname;
};

const getServerIP = () => {
  var interfaces = os.networkInterfaces();
  var addresses = {};
  for (var k in interfaces) {
    addresses[k] = [];
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      addresses[k].push(address.address);
    }
  }
  logger.info("Network interfaces", addresses);
  return addresses;
};

/**
 * Returns the result of the database connection
 * @param {*} config
 * @returns {
 *  status : "SUCCESS" | "FAILED"
 * }
 */
const testDatabaseConnection = async (config) => {
  const dbConfig = config.database;
  let response = {
    config: dbConfig,
    status: "FAILURE",
  };

  if (config.database) {
    try {
      const hck = dbConfig.healthcheck;
      if (!hck) {
        response.status = "NO_CONFIG";
        response.error = "No database health check has been configured";
        return response;
      }
      Object.assign(response, await hck(dbConfig));
    } catch (err) {
      logger.error("Database healthcheck has failed", err);
      response.error = err;
      response.status = "FAILURE";
    }
  } else {
    logger.warn("No configuration for the database health check");
  }

  return response;
};

const testHealthChecks = async (config) => {
  const healthchecks = [];

  if (config.healthchecks) {
    logger.info(
      "-----------------------------------------",
      config.healthchecks
    );
    logger.info("Healthchecks...");
    for (let hck of config.healthchecks) {
      const hhResponse = await netutils.scanPort(hck);
      logger.info("HH<", hhResponse);
      healthchecks.push(hhResponse);
    }
    logger.info("-----------------------------------------");
  }

  return healthchecks;
};

exports.getHostname = getHostname;
exports.getServerIP = getServerIP;
exports.testDatabaseConnection = testDatabaseConnection;
exports.testHealthChecks = testHealthChecks;
