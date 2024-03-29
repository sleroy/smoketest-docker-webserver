const net = require("net");
const logger = require("../logger");

function scanPort(ip, port) {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();

    // Set a timeout for the connection attempt
    socket.setTimeout(1000);

    socket.on("connect", () => {
      // The port is open
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      // The connection attempt timed out
      socket.destroy();
      resolve(false);
    });

    socket.on("error", (error) => {
      // The port is closed or there was an error
      socket.destroy();
      reject(error);
    });

    // Attempt to connect to the specified IP and port
    socket.connect(port, ip);
  });
}

async function checkPortStatus(connectionDetails) {
  const port = connectionDetails.port;
  const ip = connectionDetails.ip;
  try {
    logger.info(`Test port ${port} of ${ip}`);
    const isOpen = await scanPort(connectionDetails.ip, connectionDetails.port);
    if (isOpen) {
      logger.info(
        `Port ${connectionDetails.port} is open on ${connectionDetails.ip}`
      );
      return {
        ip,
        port,
        status: "SUCCESS",
      };
    } else {
      logger.error(
        `Port ${connectionDetails.port} is closed on ${connectionDetails.ip}`
      );
      return {
        ip,
        port,
        status: "FAILED",
        error: `Port ${connectionDetails.port} is closed on ${connectionDetails.ip}`,
      };
    }
  } catch (error) {
    logger.error("Cannot reach the port for the reason", error);
    return {
      ip,
      port,
      status: "FAILED",
      error: error,
    };
  }
}

exports.scanPort = checkPortStatus;
