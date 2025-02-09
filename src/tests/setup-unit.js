/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
import { stat, mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

export default async function () {
  const fetch = (await import("node-fetch")).default;
  const SERVER = "https://desmos.com";
  const CACHE_FOLDER = "node_modules/.cache/desmos";
  const CALC_DESKTOP = `${CACHE_FOLDER}/calculator_desktop.js`;
  const PREFIX = '<script src="/assets/build/shared_calculator_desktop';

  const calculatorLink = `${SERVER}/calculator`;

  const stats = await stat(CALC_DESKTOP).catch(() => undefined);

  // download and cache calculator_desktop.js if it doesn't exist already
  // or if it's more than a day old as measured by modified time (mtime).
  if (!stats || Date.now() - stats.mtime > 1000 * 60 * 60 * 24) {
    console.log(
      `Downloading '${calculatorLink}' to find the calculator_desktop URL`
    );

    const calculator = await (await fetch(calculatorLink)).text();
    const [jsScriptLine] = calculator
      .split("\n")
      .filter((line) => line.includes(PREFIX));

    if (!jsScriptLine) {
      console.error("Error: Could not find calculator_desktop.");
      exit(1);
    }

    const calculatorDesktopLink = `${SERVER}${jsScriptLine.split('"')[1]}`;

    console.log(`Downloading latest calculator_desktop`);
    const calculatorDesktop = await (await fetch(calculatorDesktopLink)).text();

    // Insert some newlines, so lines are shorter if any errors get logged.
    // Skip the first 50 lines since those are worker code
    const calcDesktopSplit = calculatorDesktop.split("\n");
    const reformattedCalculatorDesktop = [
      ...calcDesktopSplit.slice(0, 50),
      calcDesktopSplit
        .slice(50)
        .join("\n")
        .replace(/(![01])/g, (v) => `${v}\n`),
    ].join("\n");

    await mkdir(dirname(CALC_DESKTOP), {
      recursive: true,
    });
    await writeFile(CALC_DESKTOP, reformattedCalculatorDesktop);

    console.log("Download finished.");
  }
};
