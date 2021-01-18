/* eslint-disable import/no-extraneous-dependencies */
import { delegateToSchema } from '@graphql-tools/delegate';
import { UserInputError, AuthenticationError, gql } from 'apollo-server';

import bcrypt from 'bcrypt';

export default class ResolverHandler {
  checkForErrorsAndThrow(errors) {
    if (errors) {
      throw new UserInputError(errors.map((e) => e.message).join('\n'));
    }
  }

  async createUser(args, context, executor) {
    const { name, email, password } = args;
    if (password.length < 8) {
      throw new UserInputError('Password is too short!');
    }
    const hashedPw = bcrypt.hashSync(password, 10);
    const createPerson = gql`
      mutation ($name: String!, $email: String!, $hashedPw: String!) {
        createPerson(data: {name: $name, email: $email, hashedPw: $hashedPw}) {
          id
        }
      }
    `;
    const executable = {
      document: createPerson,
      variables: { name, email, hashedPw },
    };
    const { data, errors } = await executor(executable);
    this.checkForErrorsAndThrow(errors);
    const { createPerson: person } = data;
    return context.jwtSign(person.id);
  }

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
    this.checkForErrorsAndThrow(errors);
    const { person } = data;
    if (person && bcrypt.compareSync(args.password, person.hashedPw)) {
      return context.jwtSign(person.id);
    }
    throw new AuthenticationError('Wrong email/password combination');
  }

  createPost(args, context, info, schema) {
    const { title } = args.post || {};
    const { id } = context.user;
    return delegateToSchema({
      schema,
      operation: 'mutation',
      fieldName: 'createPost',
      args: {
        data: {
          title,
          author: { connect: { id } },
        },
      },
      context,
      info,
    });
  }

  deletePost(args, context, info, schema) {
    const { id: postId } = args;
    return delegateToSchema({
      schema,
      operation: 'mutation',
      fieldName: 'deletePost',
      args: {
        where: {
          id: postId,
        },
      },
      context,
      info,
    });
  }

  upvotePost(args, context, info, schema) {
    const { id: postId } = args;
    const { id: personId } = context.user;
    return delegateToSchema({
      schema,
      operation: 'mutation',
      fieldName: 'updatePost',
      args: {
        where: {
          id: postId,
        },
        data: {
          usersUpvoted: { connect: [{ where: { id: personId } }] },
          usersDownvoted: { disconnect: [{ id: personId }] },
        },
      },
      context,
      info,
    });
  }

  downvotePost(args, context, info, schema) {
    const { id: postId } = args;
    const { id: personId } = context.user;
    return delegateToSchema({
      schema,
      operation: 'mutation',
      fieldName: 'updatePost',
      args: {
        where: {
          id: postId,
        },
        data: {
          usersDownvoted: { connect: [{ where: { id: personId } }] },
          usersUpvoted: { disconnect: [{ id: personId }] },
        },
      },
      context,
      info,
    });
  }
}
