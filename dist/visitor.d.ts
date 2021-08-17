import { ClientSideBasePluginConfig, LoadedFragment } from "@graphql-codegen/visitor-plugin-common";
import { OperationDefinitionNode, GraphQLSchema } from "graphql";
import { Types } from "@graphql-codegen/plugin-helpers";
export interface MethodsPluginConfig extends ClientSideBasePluginConfig {
}
export declare class MethodsVisitor {
    protected rawConfig: MethodsPluginConfig;
    private imports;
    private mutations;
    private subscriptions;
    private queries;
    constructor(schema: GraphQLSchema, fragments: LoadedFragment[], rawConfig: MethodsPluginConfig, documents: Types.DocumentFile[]);
    private getImportStatement;
    private getReactImport;
    private getOmitDeclaration;
    getBaseClass: () => string;
    protected buildOperation: (node: OperationDefinitionNode, documentVariableName: string, operationType: string, operationResultType: string, operationVariablesTypes: string, hasRequiredVariables: boolean) => string;
    OperationDefinition: (node: OperationDefinitionNode) => string;
    output: () => string;
}
