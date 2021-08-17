import {
  ClientSideBaseVisitor,
  ClientSideBasePluginConfig,
  getConfigValue,
  LoadedFragment,
  OMIT_TYPE,
  DocumentMode,
} from "@graphql-codegen/visitor-plugin-common"
import { OperationDefinitionNode, Kind, GraphQLSchema } from "graphql"
import { Types } from "@graphql-codegen/plugin-helpers"
import { pascalCase } from "change-case-all"
import { camelCase } from "change-case-all"

const APOLLO_CLIENT_3_UNIFIED_PACKAGE = `@apollo/client`
const GROUPED_APOLLO_CLIENT_3_IDENTIFIER = "Apollo"

export interface MethodsPluginConfig extends ClientSideBasePluginConfig {
  //   withComponent: boolean
  //   withHOC: boolean
  //   withHooks: boolean
  //   withMutationFn: boolean
  //   withRefetchFn: boolean
  //   apolloReactCommonImportFrom: string
  //   apolloReactComponentsImportFrom: string
  //   apolloReactHocImportFrom: string
  //   apolloReactHooksImportFrom: string
  //   componentSuffix: string
  //   reactApolloVersion: 2 | 3
  //   withResultType: boolean
  //   withMutationOptionsType: boolean
  //   addDocBlocks: boolean
  //   defaultBaseOptions: { [key: string]: string }
}

// export class MethodsVisitor extends ClientSideBaseVisitor<
//   {},
//   MethodsPluginConfig
// > {
export class MethodsVisitor {
  // private _externalImportPrefix: string
  private typeImportsPath = "./types.generated.ts"
  private imports = new Set<string>()
  // private _documents: Types.DocumentFile[]
  private mutations = new Set<string>()
  private subscriptions = new Set<string>()
  private queries = new Set<string>()

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    protected rawConfig: MethodsPluginConfig,
    documents: Types.DocumentFile[]
  ) {
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

  private getImportStatement = (isTypeImport: boolean): string => {
    return isTypeImport ? "import type" : "import"
  }

  private getReactImport = (): string => {
    return `import * as React from 'react';`
  }

  private getOmitDeclaration(): string {
    return OMIT_TYPE
  }

  // private getDocumentNodeVariable = (
  //   node: OperationDefinitionNode,
  //   documentVariableName: string
  // ): string => {
  //   return this.config.documentMode === DocumentMode.external
  //     ? `Operations.${node.name?.value ?? ""}`
  //     : documentVariableName
  // }

  getImports = () => {
    let queriesImports = Array.from(this.queries).map((name) => [
      `${name}Query`,
      `${name}QueryVariables`,
      `${name}Document`,
    ])
    let mutationsImports = Array.from(this.mutations).map((name) => [
      `${name}Mutation`,
      `${name}MutationVariables`,
      `${name}Document`,
    ])
    let subscriptionsImports = Array.from(this.subscriptions).map((name) => [
      `${name}Subscription`,
      `${name}SubscriptionVariables`,
      `${name}Document`,
    ])

    let imports = queriesImports
      .concat(mutationsImports)
      .concat(subscriptionsImports)
      .reduce((acc, x) => [...acc, ...x], [])

    return `
      import { ApolloClient } from '@apollo/client';
      import {
        ${imports.join(",\n")}
      } from '${this.typeImportsPath}';\n
      `
  }

  getBaseClass = () => {
    let mutations: string[] = Array.from(this.mutations)
    let toMutation = (name: string) => {
      name = pascalCase(name)
      return `
      mutate${name} = async (variables: ${name}MutationVariables) => {
        return this.client.mutate<
          ${name}Mutation,
          ${name}MutationVariables
          >({
            mutation: ${name}Document,
            variables,
        });
  }\n
  `
    }
    let base = `
        class GQLMethods {
            private client: ApolloClient;

            constructor(client: ApolloClient) {
                this.client = client;
            }

            ${mutations.map(toMutation)}
        }
      
      `

    return base
  }

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

  protected buildOperation = (
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
    hasRequiredVariables: boolean
  ): string => {
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
      .join("\n")
  }

  public OperationDefinition = (node: OperationDefinitionNode): string => {
    let name = node.name?.value
    if (!name) {
      return ""
    }

    if (node.operation === "query") {
      this.queries.add(name)
    } else if (node.operation === "mutation") {
      this.mutations.add(name)
    }
    if (node.operation === "subscription") {
      this.subscriptions.add(name)
    }
    return ""
  }
}
