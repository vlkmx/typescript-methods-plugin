import { Types, PluginFunction } from "@graphql-codegen/plugin-helpers"
import { visit, GraphQLSchema, concatAST } from "graphql"
import { MethodsVisitor } from "./visitor"
import pretier from "prettier"

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
  visit(allAst, { leave: visitor })
  const content = [visitor.getImports(), visitor.getBaseClass()].join("\n")
  const formattedContent = pretier.format(content, {
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    printWidth: 100,
    trailingComma: "all",
    parser: "typescript",
  })

  return {
    content: formattedContent,
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
