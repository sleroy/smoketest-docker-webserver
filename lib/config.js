/** Load the server configuration from a file or build it from environment variables */
const logger = require("./logger");
const dbHealthCheck = require("./db");

/**
 * The configuration format should looks like :
 * {
  "database": {
    "type": "mysql",
    "host": "my-database-host",
    "port": 3306,
    "user": "myuser",
    "password": "mypassword",
    "timeout" : 10,
    "debug": "false"
  }
}
 */
function loadDatabaseConfiguration() {
  const dbType = process.env.DB_TYPE;
  if (!dbType) {
    logger.warn("No database type defined.");
    return undefined;
  }
  logger.info("Database type : " + dbType + ".");

  let database = {
    type: dbType,
  };
  database.timeout = Number(process.env.DB_TIMEOUT) || 1800;
  database.debug = process.env.DB_DEBUG || false;
  const healthcheckDef = dbHealthCheck(dbType);
  // Reload the configuration
  database = healthcheckDef.loadConfig(database);
  database.healthcheck = healthcheckDef.healthcheck;

  return database;
}

function loadConfigurationFromFile(configFileLocation) {
  try {
    const os = require("fs");
    const config = os.readFileSync(configFileLocation);
    return JSON.parse(config);
  } catch (error) {
    logger.error("Error while loading configuration file : " + error);
  }
}

function loadHealthchecks() {
  const healthchecks = [];
  if (process.env.HEALTHCHECK_1) {
    healthchecks.push(parseHealthcheckEnvVar(process.env.HEALTHCHECK_1));
  }
  if (process.env.HEALTHCHECK_2) {
    healthchecks.push(parseHealthcheckEnvVar(process.env.HEALTHCHECK_2));
  }
  if (process.env.HEALTHCHECK_3) {
    healthchecks.push(parseHealthcheckEnvVar(process.env.HEALTHCHECK_3));
  }
  logger.info("Healthchecks results ", healthchecks);
  return healthchecks;
}

/**
 * Check the availability of a port. It takes an IP and a port with the format [ip:port]
 * @param {*} connectionString a string that represent an healthcheck
 */
function parseHealthcheckEnvVar(connectionString) {
  // Define a regular expression to match IP or FQDN and port
  const regex = /^([^:]+):(\d+)$/;

  // Use the regular expression to match against the input string
  const match = connectionString.match(regex);

  if (match) {
    // Extract the matched values
    const ip = match[1];
    const port = parseInt(match[2], 10); // Convert port to integer

    // Return the result as an object
    return { ip, port };
  } else {
    // Return null if the input string doesn't match the expected format
    return null;
  }
}

function loadConfiguration() {
  // Database type (mysql, mongodb, dynamodb, etc.).
  if (process.env.CONFIG) {
    return loadConfigurationFromFile(process.env.CONFIG);
  }
  try {
    const database = loadDatabaseConfiguration();
    const healthchecks = loadHealthchecks();
    logger.info(`${healthchecks.length} healthchecks have been declared.`);
    const config = {
      database: database,
      healthchecks: healthchecks,
    };
    return config;
  } catch (error) {
    logger.error("Error while loading configuration : " + error);
    return {};
  }
}

module.exports.load = loadConfiguration;
