/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { DataSource } from 'apollo-datasource';
import { delegateToSchema } from '@graphql-tools/delegate';
// import { GraphQLClient } from 'graphql-request';
import { UserInputError, AuthenticationError, gql } from 'apollo-server';

import bcrypt from 'bcrypt';

import crypto from 'crypto';

import Post from './Post';
import User from './User';

export default class InMemoryDataSource extends DataSource {
  /**
   * Should be rewritten later to create unique id's based
   * on post id's already in the database
   */
  static getNewPostId() {
    return crypto.randomBytes(16).toString('hex');
  }

  static getNewUserId() {
    return crypto.randomBytes(16).toString('hex');
  }

  constructor(users = [], posts = []) {
    super();

    const bothArrays = Array.isArray(posts) && Array.isArray(users);
    const postClasses = posts.every((p) => p instanceof Post);
    const userClasses = users.every((u) => u instanceof User);

    if (bothArrays && postClasses && userClasses) {
      this.posts = posts;
      this.users = users;
    } else {
      const pString = JSON.stringify(posts, null, 2);
      const uString = JSON.stringify(users, null, 2);
      const error = new Error(`An InMemoryDataSource was instantiated with malformed posts and/or users:\nPosts: ${pString}\nUsers: ${uString}`);
      error.name = 'IllegalArgumentException';
      throw error;
    }
  }

  // createUser(data, context) {
  //   try {
  //     const { email, password } = data;
  //     const duplicateEmail = this.users.find((u) => u.email === email);
  //     const passwordSufficient = password.length >= 8;
  //     // const id = InMemoryDataSource.getNewUserId();
  //     if (passwordSufficient && !duplicateEmail) {
  //       const user = new User(data, id);
  //       this.users.push(user);
  //       return context.jwtSign({ id: user.id });
  //     }
  //     if (duplicateEmail) {
  //       return new Error('Email address already taken');
  //     }
  //     return new Error('Password is too short');
  //   } catch (e) {
  //     return e;
  //   }
  // }

  async createUser(args, context, executor) {
    const document = gql`
    mutation ($name: String!, $email: String!, $hashedPw: String!) {
      createPerson(data: {name: $name, email: $email, hashedPw: $hashedPw}) {
        id
      }
    }
    `;
    const { name, email, password } = args;
    const hashedPw = bcrypt.hashSync(password, 10);
    const variables = { name, email, hashedPw };
    const response = await executor({ document, variables });
    const { data, errors } = response;
    if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
    return context.jwtSign({ id: data.createPerson.id });
  }

  // loginUser(data, context) {
  //   const { email, password } = data;
  //   const user = this.users.find((u) => u.email === email);
  //   const correctPassword = user && user.comparePassword(password);
  //   if (user && correctPassword) {
  //     return context.jwtSign({ id: user.id });
  //   }
  //   if (!user) {
  //     return new Error('Unknown user');
  //   }
  //   return new Error('Wrong password');
  // }

  async loginUser(args, context, executor) {
    const document = gql`
    query ($email: String!) {
      person(where: {email: $email}) {
        id
        hashedPw
      }
    }
    `;
    const response = await executor({ document, variables: args });
    const { data, errors } = response;
    if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
    const { person } = data;
    if (person && bcrypt.compareSync(args.password, person.hashedPw)) {
      return context.jwtSign({ id: person.id });
    }
    throw new AuthenticationError('Wrong email/password combination');
  }

  async createPost(args, context, info, schema) {
    /* const document = gql`
    mutation ($title: String!, $authorId: ID!) {
      createPost(data: {title: $title
        author: {connect: {id: $authorId}}})  {
          id
          title
          author{
            id
          }
        }
      }
    `;
    try {
      const { id: authorId } = context.user.user;
      const { title } = args.post;
      const variables = { title, authorId };
      const response = await executor({ document, variables });
      const { data, errors } = response;
      if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
      */
    const post = {
      data: {
        title: args.post.title,
        author: {
          connect: { id: context.user.id },
        },
      },
    };
    return delegateToSchema({
      schema,
      operation: 'mutation',
      fieldName: 'createPost',
      args: post,
      context,
      info,
    });
    /* } catch (error) {
      return error;
    } */
  }

  deletePostOld({ id: postId } = {}, context) {
    const { id: author } = context.user;
    const user = this.users.find((u) => u.id === author);
    const post = this.posts.find((p) => p.id === postId);
    if (user && post && post.author === author) {
      this.posts = this.posts.filter((p) => p.id !== post.id);
      return post;
    }
    if (!user) {
      return new Error('User not found');
    }
    if (!post) {
      return new Error('Post not found');
    }
    return new Error('User does not own the rights to delete the post');
  }

  async deletePost(args, context, executor) {
    const { id: postId } = args;
    const { id: personId } = context.user;
    console.log(postId);
    console.log(personId);

    const document = gql`
      mutation ($id: ID!) {
        deletePost(
          where: { 
            id: $id
          }
        ) {
          id
          usersDownvoted { id }
          usersUpvoted { id }
        }
      }
    `;
    const response = await executor({ document, variables: { id: postId } });
    const { data, errors } = response;
    if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
    const { deletePost: post } = data;
    if (post) {
      return post;
    }
  }

  // upvotePost({ id: postId } = {}, context) {
  //   const { id: author } = context.user;
  //   const user = this.users.find((u) => u.id === author);
  //   const post = this.posts.find((p) => p.id === postId);
  //   if (user && post) {
  //     return post.upvote(author);
  //   }
  //   if (!user) {
  //     return new Error('User not found');
  //   }
  //   return new Error('Post not found');
  // }

  async upvotePost(args, context, executor) {
    const { id: postId } = args;
    const { id: personId } = context.user;
    console.log(postId);
    console.log(personId);

    const document = gql`
      mutation ($id: ID! $author: ID!) {
        updatePost(
          where: { 
            id: $id 
          }
          data: { 
            usersUpvoted: { connect: { id: $author } }
            usersDownvoted:  { disconnect: { id: $author } } 
          }
        ) {
          id
          usersDownvoted { id }
          usersUpvoted { id }
        }
      }
    `;
    const response = await executor({ document, variables: { id: postId, author: personId } });
    const { data, errors } = response;
    if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));
    const { updatePost: post } = data;
    if (post) {
      return post;
    }
    // throw new AuthenticationError('Wrong email/password combination');
  }

  downvotePost({ id: postId } = {}, context) {
    const { id: author } = context.user;
    const user = this.users.find((u) => u.id === author);
    const post = this.posts.find((p) => p.id === postId);
    if (user && post) {
      return post.downvote(author);
    }
    if (!user) {
      return new Error('User not found');
    }
    return new Error('Post not found');
  }

  // async upvotePost(parent, args, context) {
  //   const personId = context.user.id;
  //   const postId = args.id;

  //   const mutation = gql`
  //       mutation($postId: ID!, $personId: ID!) {
  //         updatePost(
  //           where: { id: $postId }
  //           data: { usersUpvoted: { connect: { where: { id: $personId } } } }
  //         ) {
  //           id
  //         }
  //       }
  //     `;
  // }
}
