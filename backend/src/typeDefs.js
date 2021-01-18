import { gql } from 'apollo-server';

export default gql`
  extend type Post {
    votes: Int!
  }

  type Mutation {
    write(post: PostInput!): Post
    delete(id: ID!): Post
    upvote(id: ID!): Post
    downvote(id: ID): Post
    signup(name: String!, email: String!, password: String!): String
    login(email: String!, password: String!): String
  }

  input PostInput {
    title: String!
  }
`;
