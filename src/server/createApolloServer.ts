import { ApolloServer, gql } from 'apollo-server-koa'
import { map } from 'lodash'
import typeDefs from './apollo/schema'

console.log('typeDefs', typeDefs)

export default function createApolloServer ({ pouchdb }: {pouchdb: any}) {
  const resolvers = {
    Query: {
      hello () { return 'Hello world!' },
      packages () {
        return pouchdb.allDocs({include_docs: true}).then((res:any) => res.rows.map((({doc}: {doc: any}) => doc)))
      },
      dependencies () {
        return pouchdb.query('packages/dependencies').then((res: any) => res.rows.map(({key: [name, version]}: {key: [string, string]}) => ({name, version})))
      }
    },
    Package: {
      dependencies (pkg: any) {
        return [...Object.keys(pkg.dependencies || {}).map(k => ({ name: k, version: pkg.dependencies[k] }))]
      }
    },
    Module: {
      packages (md: any) {
        console.log([md.name, md.version])
        return pouchdb.query('packages/dependencies', {key: [md.name, md.version]}).then(({rows}: {rows: any[]}) => rows.map(({value}: {value: any}) => value.package))
      }
    }
  }
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}