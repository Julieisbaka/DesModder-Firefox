/* eslint-disable @typescript-eslint/no-require-imports */
import { promises } from "fs";
const { readFile } = promises;
import { tmpdir } from "os";
import { join } from "path";
import { connect } from "puppeteer";
import { TestEnvironment as NodeEnvironment } from "jest-environment-node";

const DIR = join(tmpdir(), "jest_puppeteer_global_setup");

class PuppeteerEnvironment extends NodeEnvironment {
  async setup() {
    await super.setup();
    // get the wsEndpoint
    const wsEndpoint = await readFile(join(DIR, "wsEndpoint"), "utf8");
    if (!wsEndpoint) throw new Error("wsEndpoint not found");

    // connect to puppeteer
    this.global.__BROWSER_GLOBAL__ = await connect({
      browserWSEndpoint: wsEndpoint,
    });
  }

  async teardown() {
    this.global.__BROWSER_GLOBAL__?.disconnect();
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export default PuppeteerEnvironment;
