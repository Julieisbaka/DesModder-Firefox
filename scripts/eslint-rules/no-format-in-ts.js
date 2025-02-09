export const name = "no-format-in-ts";
export const meta = {
  type: "problem",
  docs: {
    description: "Disallow using format() in TS files. ",
    category: "Best Practices",
  },
  messages: {
    noFormatInTS: "Avoid using format() in TS files. " +
      "Use format() only where it will be updated by a view update.",
  },
  schema: [],
};
export function create(context) {
  return {
    CallExpression: function (node) {
      if (node.callee.type === "Identifier" &&
        node.callee.name === "format") {
        const filename = context.filename ?? context.getFilename();
        if (!filename.endsWith(".jsx") && !filename.endsWith(".tsx")) {
          context.report({
            messageId: "noFormatInTS",
            node: node.callee,
            data: {},
          });
        }
      }
    },
  };
}
