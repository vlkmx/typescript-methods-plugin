"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
var graphql_1 = require("graphql");
var visitor_1 = require("./visitor");
var prettier_1 = require("prettier");
var plugin = function (schema, documents, config) {
    var allAst = graphql_1.concatAST(documents.map(function (v) { return v.document; }));
    // const allFragments: LoadedFragment[] = [
    //   ...(
    //     allAst.definitions.filter(
    //       (d) => d.kind === Kind.FRAGMENT_DEFINITION
    //     ) as FragmentDefinitionNode[]
    //   ).map((fragmentDef) => ({
    //     node: fragmentDef,
    //     name: fragmentDef.name.value,
    //     onType: fragmentDef.typeCondition.name.value,
    //     isExternal: false,
    //   })),
    // ]
    var visitor = new visitor_1.MethodsVisitor();
    graphql_1.visit(allAst, { leave: visitor });
    var content = [visitor.getImports(), visitor.getBaseClass()].join("\n");
    var formattedContent = prettier_1.default.format(content, {
        semi: true,
        singleQuote: true,
        tabWidth: 4,
        printWidth: 100,
        trailingComma: "all",
        parser: "typescript",
    });
    return {
        content: formattedContent,
    };
};
exports.plugin = plugin;
// export const validate: PluginValidateFn<any> = async (
//   schema: GraphQLSchema,
//   documents: Types.DocumentFile[],
//   config: MethodsPluginConfig,
//   outputFile: string
// ) => {
//   if (extname(outputFile) !== ".ts" && extname(outputFile) !== ".tsx") {
//     throw new Error(
//       `Plugin "typescript-methods" requires extension to be ".ts" or ".tsx"!`
//     )
//   }
// }
// export { MethodsVisitor }
//# sourceMappingURL=index.js.map