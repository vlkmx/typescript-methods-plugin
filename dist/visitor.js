"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodsVisitor = void 0;
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var change_case_all_1 = require("change-case-all");
var APOLLO_CLIENT_3_UNIFIED_PACKAGE = "@apollo/client";
var GROUPED_APOLLO_CLIENT_3_IDENTIFIER = "Apollo";
// export class MethodsVisitor extends ClientSideBaseVisitor<
//   {},
//   MethodsPluginConfig
// > {
var MethodsVisitor = /** @class */ (function () {
    function MethodsVisitor(schema, fragments, rawConfig, documents) {
        // super(schema, fragments, rawConfig, {})
        var _this = this;
        this.rawConfig = rawConfig;
        // private _externalImportPrefix: string
        this.imports = new Set();
        // private _documents: Types.DocumentFile[]
        this.mutations = new Set();
        this.subscriptions = new Set();
        this.queries = new Set();
        this.getImportStatement = function (isTypeImport) {
            return isTypeImport ? "import type" : "import";
        };
        this.getReactImport = function () {
            return "import * as React from 'react';";
        };
        // private getDocumentNodeVariable = (
        //   node: OperationDefinitionNode,
        //   documentVariableName: string
        // ): string => {
        //   return this.config.documentMode === DocumentMode.external
        //     ? `Operations.${node.name?.value ?? ""}`
        //     : documentVariableName
        // }
        this.getBaseClass = function () {
            var mutations = [];
            var toMutation = function (name) {
                name = change_case_all_1.pascalCase(name);
                return "\n      mutate" + name + " = async (variables: " + name + "MutationVariables) => {\n        return this.client.mutate<\n          " + name + "Mutation,\n          " + name + "MutationVariables\n          >({\n            mutation: " + name + "Document,\n            variables,\n        });\n  }\n\n  ";
            };
            var base = "\n        class GQLMethods<ClientType> {\n            client: ClientType;\n\n            constructor(client: ClientType) {\n                this.client = client;\n            }\n\n            " + mutations.map(function (x) { return toMutation(x.name); }) + "\n        }\n      \n      ";
            return base;
        };
        // public getImports = (): string[] => {
        //   const baseImports = super.getImports()
        //   const hasOperations = this._collectedOperations.length > 0
        //   if (!hasOperations) {
        //     return baseImports
        //   }
        //   return [...baseImports, ...Array.from(this.imports)]
        // }
        //   private _buildResultType(
        //     node: OperationDefinitionNode,
        //     operationType: string,
        //     operationResultType: string,
        //     operationVariablesTypes: string
        //   ): string {
        //     const componentResultType = this.convertName(node.name?.value ?? "", {
        //       suffix: `${operationType}Result`,
        //       useTypesPrefix: false,
        //     })
        //     switch (node.operation) {
        //       case "query":
        //         this.imports.add(this.getApolloReactCommonImport(true))
        //         return `export type ${componentResultType} = ${this.getApolloReactCommonIdentifier()}.QueryResult<${operationResultType}, ${operationVariablesTypes}>;`
        //       case "mutation":
        //         this.imports.add(this.getApolloReactCommonImport(true))
        //         return `export type ${componentResultType} = ${this.getApolloReactCommonIdentifier()}.MutationResult<${operationResultType}>;`
        //       case "subscription":
        //         this.imports.add(this.getApolloReactCommonImport(true))
        //         return `export type ${componentResultType} = ${this.getApolloReactCommonIdentifier()}.SubscriptionResult<${operationResultType}>;`
        //       default:
        //         return ""
        //     }
        //   }
        this.buildOperation = function (node, documentVariableName, operationType, operationResultType, operationVariablesTypes, hasRequiredVariables) {
            // operationResultType = this._externalImportPrefix + operationResultType
            // operationVariablesTypes =
            //   this._externalImportPrefix + operationVariablesTypes
            return [
                node,
                documentVariableName,
                operationType,
                operationResultType,
                operationVariablesTypes,
                hasRequiredVariables,
            ]
                .filter(Boolean)
                .join("\n");
        };
        this.output = function () {
            return _this.getBaseClass();
        };
        // this._externalImportPrefix = this.config.importOperationTypesFrom
        //   ? `${this.config.importOperationTypesFrom}.`
        //   : ""
        // this._documents = documents
        console.log("@@ VISITOR", documents.map(function (x) { var _a; return (_a = x.document) === null || _a === void 0 ? void 0 : _a.definitions; }));
    }
    MethodsVisitor.prototype.getOmitDeclaration = function () {
        return visitor_plugin_common_1.OMIT_TYPE;
    };
    MethodsVisitor.prototype.OperationDefinition = function (node) {
        var _a;
        var name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value;
        if (!name) {
            return "";
        }
        if (node.operation === "query") {
            this.queries.add(name);
        }
        else if (node.operation === "mutation") {
            this.mutations.add(name);
        }
        if (node.operation === "subscription") {
            this.subscriptions.add(name);
        }
        return "";
    };
    return MethodsVisitor;
}());
exports.MethodsVisitor = MethodsVisitor;
//# sourceMappingURL=visitor.js.map