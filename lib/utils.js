var os = require("os");
var hostname = os.hostname();

const getHostname = () => {
  return hostname;
};

const getServerIP = () => {
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
      var address = interfaces[k][k2];
      addresses.push(address.address);
    }
  }
  console.log(addresses);
  return addresses;

};

exports.getHostname = getHostname;
exports.getServerIP = getServerIP;
