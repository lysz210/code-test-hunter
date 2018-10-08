import { ApolloServer, gql } from 'apollo-server-koa'

const typeDefs = gql`
type Query {
  hello: String
}
`;

const resolvers = {
  Query: {
    hello () { return 'Hello world!' }
  }
}

export default function createApolloServer () {
  return new ApolloServer({
    typeDefs,
    resolvers
  })
}