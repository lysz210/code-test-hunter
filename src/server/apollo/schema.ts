import { gql } from 'apollo-server-koa'

export const Query = gql`
type Query {
  hello: String,
  packages: [Package]
  dependencies: [Module]
}`

export const Package = gql`
type Package {
  _id: String,
  name: String,
  dependencies: [Module],
  devDependencies: [Module]
}`

export const Module = gql`
"""
Module type
===

It describes a module
"""
type Module {
  """
  name of the **module**
  """
  name: String,
  version: String,
  packages: [Package]
}`

export default [
  Query,
  Module,
  Package
]