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
      Object.assign(response, await hck(dbConfig));
    } catch (err) {
      logger.error("Database healthcheck has failed", err);
      response.error = err;
      response.status = "FAILURE";
    }
  }

  return response;
};

const testHealthChecks = async (config) => {
  let response = {
    healthchecks: [],
  };

  if (config.healthchecks) {
    logger.info(
      "-------------------------------------------------------------------",
      config.healthchecks
    );
    logger.info("Healthchecks...");
    for (let hck of config.healthchecks) {
      logger.info("healthcheck test " + hck);
      response.healthchecks.push(await netutils.scanPort(hck));
    }
    logger.info(
      "-------------------------------------------------------------------"
    );
  }

  return response;
};

exports.getHostname = getHostname;
exports.getServerIP = getServerIP;
exports.testDatabaseConnection = testDatabaseConnection;
exports.testHealthChecks = testHealthChecks;
