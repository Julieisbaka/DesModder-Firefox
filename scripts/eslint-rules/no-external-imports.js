export const name = "no-external-imports";
export const meta = {
  type: "problem",
  docs: {
    description: "Disallow importing in violation of package.json 'imports'",
    category: "Best Practices",
  },
  messages: {
    noExternalImports: "Avoid importing from sub-projects other than specified in 'imports'. " +
      "If you're just using types, write 'import type ...'",
  },
  schema: [],
};
export function create(context) {
  if (!context.filename.includes("text-mode-core")) return {};
  return {
    ImportDeclaration: function (node) {
      if (node.source.type === "Literal" && node.importKind !== "type") {
        const source = node.source.value;
        if (source[0] !== "." && source[0] !== "#") {
          context.report({
            messageId: "noExternalImports",
            node: node.source,
            data: {},
          });
        }
      }
    },
  };
}
