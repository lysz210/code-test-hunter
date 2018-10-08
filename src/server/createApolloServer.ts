import { ApolloServer, gql } from 'apollo-server-koa'
import { map } from 'lodash'
import typeDefs from './apollo/schema'

export default function createApolloServer ({ pouchdb }: {pouchdb: any}) {
  const resolvers = {
    Query: {
      hello () { return 'Hello world!' },
      dependencies () {
        return pouchdb.query('packages/dependencies').then((docs:any) => {
          return map(docs.rows, ({ key: [name, version]}: {key: string[]}) => {
            return {name, version}
          })
        })
      }
    }
  }
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}