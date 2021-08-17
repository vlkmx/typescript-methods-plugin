import { Types, PluginFunction } from "@graphql-codegen/plugin-helpers"
import { visit, GraphQLSchema, concatAST } from "graphql"
import { MethodsVisitor } from "./visitor"

export const plugin: PluginFunction<{}, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: {}
) => {
  const allAst = concatAST(documents.map((v) => v.document!))
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

  const visitor = new MethodsVisitor()
  const visitorResult = visit(allAst, { leave: visitor })

  return {
    content: [visitor.getImports(), visitor.getBaseClass()].join("\n"),
  }
}

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
