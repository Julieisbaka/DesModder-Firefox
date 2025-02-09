// eslint-disable-next-line @typescript-eslint/no-require-imports
import config, { testPathIgnorePatterns as _testPathIgnorePatterns } from "./jest-base.config";
/** @type any */
export default {
  ...config,
  testPathIgnorePatterns: _testPathIgnorePatterns.concat([
    "\\.unit\\.",
    "intellisense",
  ]),
  testEnvironment: "./src/tests/puppeteer-environment.js",
  globalSetup: "./src/tests/setup-integration.js",
  globalTeardown: "./src/tests/teardown.js",
  setupFilesAfterEnv: ["jest-expect-message"],
};
