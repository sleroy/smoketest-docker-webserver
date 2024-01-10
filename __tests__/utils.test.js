const os = require("os");
const utils = require("../lib/utils");

test("validates that getHostName returns the os.hostname", () => {
  expect(utils.getHostname()).toBe(os.hostname());
});

test("validates that we collect network interfaces", () => {
  const networkInterfaces = utils.getServerIP();
  expect(networkInterfaces).toBeDefined();
  for (let key in networkInterfaces) {
    expect(networkInterfaces[key]).toBeDefined();
    expect(networkInterfaces[key].length).toBeGreaterThan(0);
  }
});
