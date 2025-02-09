// eslint-disable-next-line @typescript-eslint/no-require-imports
import configIntegration, { testPathIgnorePatterns as _testPathIgnorePatterns } from "./jest-integration.config";
/** @type any */
export default {
  ...configIntegration,
  testPathIgnorePatterns: _testPathIgnorePatterns.filter(
    (e) => e !== "intellisense"
  ),
};
