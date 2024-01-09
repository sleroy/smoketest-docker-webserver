var express = require('express');
var router = express.Router();

var utils = require('../lib/utils')

/* GET home page. */
router.get('/', function(req, res, next) {
  const addresses = utils.getServerIP();
  const hostname = utils.getHostname();

  res.render('index', { title: 'WebServer', addresses,hostname});
});

module.exports = router;
