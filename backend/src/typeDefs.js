const { gql } = require('apollo-server');


module.exports = gql`
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Post {
  id: ID!
  title: String!
  votes: Int!
  author: User!
}

type User {
  name: ID!
  posts: [Post]
}


# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  posts: [Post],
  users: [User]
}
`;


