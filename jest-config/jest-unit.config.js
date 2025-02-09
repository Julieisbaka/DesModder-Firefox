/**
 * @type {import('@jest/types').Config.ProjectConfig}
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
import config, { testPathIgnorePatterns as _testPathIgnorePatterns } from "./jest-base.config";
/** @type any */
export default {
  ...config,
  testPathIgnorePatterns: _testPathIgnorePatterns.concat("\\.int\\."),
  testEnvironment: "jsdom",
  globalSetup: "./src/tests/setup-unit.js",
};
