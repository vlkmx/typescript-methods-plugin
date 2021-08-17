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
    // private _documents: Types.DocumentFile[]
    function MethodsVisitor(schema, fragments, rawConfig, documents) {
        // super(schema, fragments, rawConfig, {})
        this.rawConfig = rawConfig;
        // private _externalImportPrefix: string
        this.imports = new Set();
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
        // this._externalImportPrefix = this.config.importOperationTypesFrom
        //   ? `${this.config.importOperationTypesFrom}.`
        //   : ""
        // this._documents = documents
        console.log("@@ VISITOR", fragments, documents);
    }
    MethodsVisitor.prototype.getOmitDeclaration = function () {
        return visitor_plugin_common_1.OMIT_TYPE;
    };
    MethodsVisitor.prototype.OperationDefinition = function (node) {
        return "";
    };
    return MethodsVisitor;
}());
exports.MethodsVisitor = MethodsVisitor;
//# sourceMappingURL=visitor.js.map