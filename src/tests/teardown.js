/* eslint-disable @typescript-eslint/no-require-imports */
import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const DIR = join(tmpdir(), "jest_puppeteer_global_setup");
export default async function () {
  // close the browser instance
  await globalThis.__BROWSER_GLOBAL__.close();

  // clean-up the wsEndpoint file
  await fs.rm(DIR, { recursive: true, force: true });
};
