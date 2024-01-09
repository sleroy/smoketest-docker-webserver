var express = require("express");
var router = express.Router();

var logger = require("../lib/logger");
var utils = require("../lib/utils");

function loadRoutes(config) {
  /* GET home page. */
  router.get("/", async (req, res, next) => {
    try {
      const addresses = utils.getServerIP();
      const hostname = utils.getHostname();
      const databaseConnection = await utils.testDatabaseConnection(config);
      const healthchecks = await utils.testHealthChecks(config);

      res.render("index", {
        title: "WebServer",
        addresses,
        hostname,
        database: databaseConnection,
        healthchecks,
      });
    } catch (err) {
      logger.error("Cannot prepare the page");
      next(err);
    }
  });

  return router;
}

module.exports = loadRoutes;
