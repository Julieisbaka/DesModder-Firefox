/* eslint-disable @typescript-eslint/no-require-imports */
import { resolve, dirname, join } from "path";
import { existsSync, statSync } from "fs";
import { exports } from "../../text-mode-core/package.json";
import { exports as _exports } from "../../graph-state/package.json";

export const name = "no-reach-past-exports";
export const meta = {
  type: "problem",
  docs: {
    description: "Disallow importing in violation of package.json 'exports'",
    category: "Best Practices",
  },
  messages: {
    noReachPastExports: "Avoid importing past the 'exports' boundary of a sub-project.",
  },
  schema: [],
};
export function create(context) {
  return {
    ImportDeclaration: function (node) {
      if (node.source.type === "Literal") {
        const source = node.source.value;
        const filename = context.getFilename();
        if (bad(filename, source)) {
          context.report({
            messageId: "noReachPastExports",
            node: node.source,
            data: {},
          });
        }
      }
    },
  };
}

// Kinda like @nx/enforce-module-boundaries but way simpler
// Janky, good temporary though.
function bad(filename, source) {
  // TODO: handle absolutes.
  if (source[0] !== ".") return false;
  const p = resolve(dirname(filename), source);
  if (allowed.some((a) => p.endsWith(a))) return false;
  return packageDir(filename) !== packageDir(p);
}

const allowed = [
  ...Object.keys(exports).map((a) =>
    resolve("text-mode-core", a)
  ),
  ...Object.keys(_exports).map((a) => resolve("graph-state", a)),
];

function packageDir(file) {
  let dir = isDirectory(file) ? file : dirname(file);
  while (dir.length > 1) {
    if (existsSync(join(dir, "package.json"))) return dir;
    dir = dirname(dir);
  }
  return dir;
}

function isDirectory(file) {
  try {
    return statSync(file).isDirectory();
  } catch {
    return false;
  }
}
