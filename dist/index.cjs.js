"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
var graphql_1 = require("graphql");
var visitor_1 = require("./visitor");
var plugin = function (schema, documents, config) {
    var allAst = graphql_1.concatAST(documents.map(function (v) { return v.document; }));
    // console.log("@@ Schema", schema)
    // console.log("@@ DOC", documents)
    var allFragments = __spreadArray(__spreadArray([], allAst.definitions.filter(function (d) { return d.kind === graphql_1.Kind.FRAGMENT_DEFINITION; }).map(function (fragmentDef) { return ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
    }); })), (config.externalFragments || []));
    var visitor = new visitor_1.MethodsVisitor(schema, allFragments, config, documents);
    var visitorResult = graphql_1.visit(allAst, { leave: visitor });
    return {
        prepend: visitor.getImports(),
        content: __spreadArray([
            visitor.fragments
        ], visitorResult.definitions.filter(function (t) { return typeof t === "string"; })).join("\n"),
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