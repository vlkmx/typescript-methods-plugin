"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
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
        var _this = this;
        this.rawConfig = rawConfig;
        // private _externalImportPrefix: string
        this.typeImportsPath = "./types.generated.ts";
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
        this.getImports = function () {
            var queriesImports = Array.from(_this.queries).map(function (name) { return [
                name + "Query",
                name + "QueryVariables",
                name + "Document",
            ]; });
            var mutationsImports = Array.from(_this.mutations).map(function (name) { return [
                name + "Mutation",
                name + "MutationVariables",
                name + "Document",
            ]; });
            var subscriptionsImports = Array.from(_this.subscriptions).map(function (name) { return [
                name + "Subscription",
                name + "SubscriptionVariables",
                name + "Document",
            ]; });
            var imports = queriesImports
                .concat(mutationsImports)
                .concat(subscriptionsImports)
                .reduce(function (acc, x) { return __spreadArray(__spreadArray([], acc), x); }, []);
            return "\n      import { ApolloClient } from '@apollo/client';\n      import {\n        " + imports.join("\n") + "\n      } from '" + _this.typeImportsPath + "';\n\n      ";
        };
        this.getBaseClass = function () {
            var mutations = Array.from(_this.mutations);
            var toMutation = function (name) {
                name = change_case_all_1.pascalCase(name);
                return "\n      mutate" + name + " = async (variables: " + name + "MutationVariables) => {\n        return this.client.mutate<\n          " + name + "Mutation,\n          " + name + "MutationVariables\n          >({\n            mutation: " + name + "Document,\n            variables,\n        });\n  }\n\n  ";
            };
            var base = "\n        class GQLMethods {\n            private client: ApolloClient;\n\n            constructor(client: ApolloClient) {\n                this.client = client;\n            }\n\n            " + mutations.map(toMutation) + "\n        }\n      \n      ";
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
        this.OperationDefinition = function (node) {
            var _a;
            var name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value;
            if (!name) {
                return "";
            }
            if (node.operation === "query") {
                _this.queries.add(name);
            }
            else if (node.operation === "mutation") {
                _this.mutations.add(name);
            }
            if (node.operation === "subscription") {
                _this.subscriptions.add(name);
            }
            return "";
        };
        // super(schema, fragments, rawConfig, {})
        // this._externalImportPrefix = this.config.importOperationTypesFrom
        //   ? `${this.config.importOperationTypesFrom}.`
        //   : ""
        // this._documents = documents
        // console.log(
        //   "@@ VISITOR",
        //   documents.map((x) => x.document?.definitions)
        // )
        // this.mutations = new Set<string>()
        // this.subscriptions = new Set<string>()
        // this.queries = new Set<string>()
    }
    MethodsVisitor.prototype.getOmitDeclaration = function () {
        return visitor_plugin_common_1.OMIT_TYPE;
    };
    return MethodsVisitor;
}());
exports.MethodsVisitor = MethodsVisitor;
//# sourceMappingURL=visitor.js.map