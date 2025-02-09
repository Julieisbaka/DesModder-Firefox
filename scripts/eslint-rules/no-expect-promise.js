// eslint-disable-next-line @typescript-eslint/no-require-imports
import { unionTypeParts, isThenableType } from "tsutils";

export const name = "no-expect-promise";
export const meta = {
  type: "problem",
  docs: {
    // The type system does not enforce .resolves.
    description: "Disallow using expect() on a Promise.",
    category: "Best Practices",
  },
  messages: {
    noExpectPromise: "Avoid using expect() on a Promise. Did you forget an `await`?",
  },
  schema: [],
};
export function create(context) {
  return {
    CallExpression(node) {
      if (node.callee.type === "Identifier" &&
        node.callee.name === "expect" &&
        node.arguments.length > 0) {
        const { parserServices } = context.sourceCode;
        const checker = parserServices.program.getTypeChecker();
        const originalArgNode = parserServices.esTreeNodeToTSNodeMap.get(
          node.arguments[0]
        );
        if (isSometimesThenable(checker, originalArgNode))
          context.report({
            messageId: "noExpectPromise",
            node: node.arguments[0],
            data: {},
          });
      }
    },
  };
}

// https://github.com/typescript-eslint/typescript-eslint/blob/4bf2d7360eaf74c9ef87b196ff4c459b8f50800b/packages/eslint-plugin/src/rules/no-misused-promises.ts#L416
function isSometimesThenable(checker, node) {
  const _type = checker.getTypeAtLocation(node);
  const type = checker.getApparentType(_type);

  return unionTypeParts(type)
    .some((subType) => isThenableType(checker, node, subType));
}
