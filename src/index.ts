import {
  Types,
  PluginValidateFn,
  PluginFunction,
} from "@graphql-codegen/plugin-helpers"
import {
  visit,
  GraphQLSchema,
  concatAST,
  Kind,
  FragmentDefinitionNode,
} from "graphql"
import { LoadedFragment } from "@graphql-codegen/visitor-plugin-common"
import { MethodsPluginConfig, MethodsVisitor } from "./visitor"
import { extname } from "path"

export const plugin: PluginFunction<
  MethodsPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: MethodsPluginConfig
) => {
  const allAst = concatAST(documents.map((v) => v.document!))

  // console.log("@@ Schema", schema)

  // console.log("@@ DOC", documents)

  const allFragments: LoadedFragment[] = [
    ...(
      allAst.definitions.filter(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION
      ) as FragmentDefinitionNode[]
    ).map((fragmentDef) => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ]

  const visitor = new MethodsVisitor(schema, allFragments, config, documents)
  const visitorResult = visit(allAst, { leave: visitor })

  return {
    prepend: visitor.getImports(),
    content: [
      // visitor.fragments,
      // ...visitorResult.definitions.filter((t: any) => typeof t === "string"),
      visitor.getBaseClass(),
    ].join("\n"),
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
