"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodsVisitor = void 0;
var visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
var change_case_all_1 = require("change-case-all");
var APOLLO_CLIENT_3_UNIFIED_PACKAGE = "@apollo/client";
var GROUPED_APOLLO_CLIENT_3_IDENTIFIER = "Apollo";
var MethodsVisitor = /** @class */ (function (_super) {
    __extends(MethodsVisitor, _super);
    function MethodsVisitor(schema, fragments, rawConfig, documents) {
        var _this = _super.call(this, schema, fragments, rawConfig, {}) || this;
        _this.rawConfig = rawConfig;
        _this.imports = new Set();
        _this.getImportStatement = function (isTypeImport) {
            return isTypeImport && _this.config.useTypeImports ? "import type" : "import";
        };
        _this.getReactImport = function () {
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
        _this.getBaseClass = function () {
            var mutations = [];
            var base = "\n        class GQLMethods<ClientType> {\n            client: ClientType;\n\n            constructor(client: ClientType) {\n                this.client = client;\n            }\n\n            " + mutations.map(function (m) { return "\n                mutate" + change_case_all_1.pascalCase(m.name) + " = async (variables?: " + m.variablesType + ") => (variables: SendMessageMutationVariables) => {\n                return await this.client.apolloClient.mutate<\n                    SendMessageMutation,\n                    SendMessageMutationVariables\n                >({\n                    mutation: SendMessageDocument,\n                    variables,\n                });\n            }\n            "; }) + "\n        }\n      \n      ";
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
        _this.buildOperation = function (node, documentVariableName, operationType, operationResultType, operationVariablesTypes, hasRequiredVariables) {
            operationResultType = _this._externalImportPrefix + operationResultType;
            operationVariablesTypes =
                _this._externalImportPrefix + operationVariablesTypes;
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
        _this._externalImportPrefix = _this.config.importOperationTypesFrom
            ? _this.config.importOperationTypesFrom + "."
            : "";
        _this._documents = documents;
        return _this;
    }
    MethodsVisitor.prototype.getOmitDeclaration = function () {
        return visitor_plugin_common_1.OMIT_TYPE;
    };
    return MethodsVisitor;
}(visitor_plugin_common_1.ClientSideBaseVisitor));
exports.MethodsVisitor = MethodsVisitor;
//# sourceMappingURL=visitor.js.map