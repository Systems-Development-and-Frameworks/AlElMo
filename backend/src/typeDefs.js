import { gql } from 'apollo-server';

export default gql`
  type Post {
    id: ID!
    title: String!
    votes: Int!
    author: User!
    upvotes: [String]
    downvotes: [String]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post
    delete(id: ID!): Post
    upvote(id: ID!, voter: UserInput!): Post
    downvote(id: ID!, voter: UserInput!): Post
    signup(name: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
  }

  input PostInput {
    title: String!
    author: UserInput!
  }

  input UserInput {
    name: String!
  }
`;
