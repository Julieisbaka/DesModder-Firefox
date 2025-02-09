/**
 * @type {import('@jest/types').Config.ProjectConfig}
 */
export const preset = "ts-jest";
export const rootDir = "../";
export const coverageReporters = ["html", "lcov", "text"];
export const coverageDirectory = "<rootDir>/coverage";
export const transform = {
  "^.+\\.[tj]s": [
    "ts-jest",
    {
      tsconfig: {
        moduleResolution: "node",
        module: "es6",
        allowJs: true,
      },
      isolatedModules: true,
    },
  ],
  "\\.grammar": "<rootDir>/jest-config/lezer-transformer.mjs",
};
export const testPathIgnorePatterns = ["<rootDir>/node_modules/", "dist", "dist-ts"];
export const moduleDirectories = ["node_modules", "src"];
export const transformIgnorePatterns = [
  "setup-unit",
  // The following packages are ESM, and unit tests need them to be transformed.
  "node_modules/(?!ansi-regex|string-length|strip-ansi|get-east-asian-width|emoji-regex|string-width)",
];
