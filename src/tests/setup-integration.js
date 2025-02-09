/* eslint-disable @typescript-eslint/no-require-imports */
import { promises } from "fs";
const { mkdir, writeFile } = promises;
import { tmpdir } from "os";
import { join } from "path";
import { launch } from "puppeteer";

const DIR = join(tmpdir(), "jest_puppeteer_global_setup");

export default async function () {
  const pathToExtension = join(process.cwd(), "dist");
  const browser = await launch({
    headless: "new",
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ],
  });
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.__BROWSER_GLOBAL__ = browser;

  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, { recursive: true });
  await writeFile(join(DIR, "wsEndpoint"), browser.wsEndpoint());
};
