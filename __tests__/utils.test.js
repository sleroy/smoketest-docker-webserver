const os = require("os");
const utils = require("../lib/utils");

test("validates that getHostName returns the os.hostname", () => {
  expect(utils.getHostname()).toBe(os.hostname());
});

test("validates that we collect network interfaces", () => {});
