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

  getBaseClass = () => {
    let mutations: { name: string }[] = []
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
        class GQLMethods<ClientType> {
            client: ClientType;

            constructor(client: ClientType) {
                this.client = client;
            }

            ${mutations.map((x) => toMutation(x.name))}
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
    console.log("@@ope", this.queries, this.mutations)
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

  output = () => {
    return this.getBaseClass()
  }
}
