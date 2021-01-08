/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { delegateToSchema } from '@graphql-tools/delegate';
import { UserInputError, AuthenticationError, gql } from 'apollo-server';

import bcrypt from 'bcrypt';

export default class ResolverHandler {
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

  /** Hierdurch sind keine unendlich nestable Querrys möglich.
   * Mit delegateToSchema wie in "upvotePost1" wäre das möglich
   * jedoch bekommen wir dort den Error: value.map is not a function
   * Dieser ist nicht wirklich online Dokumentiert und wir bekommen den auch nur,
   * wenn wir eine ManyToMany-Anfrage stellen. Wenn wir Daten manipulieren wollen,
   * wo nur eine OneToMany-Beziehung herscht ist es kein Problem einen Post zu bearbeiten.
   * Z.B. wenn man den Author ändert.
   * Wir haben es auch mit einer Weiteren Tabelle probiert wo einzeln die die Votes gespeichert
   * werden. Dort funktioniert das manipulieren der Daten auch. Jedoch haben wir dann das Problem,
   * dass wir ein Bewertungs-Objekt zurückbekommen und kein Post.
   * Somit war das auch unbrauchbar für uns. (Beispiel siehe "upvotePost2")
   *
   * */
  async upvotePost(args, context, executor) {
    const { id: postId } = args;
    const { id: personId } = context.user;

    const document = gql`
      mutation ($id: ID! $author: ID!) {
        updatePost(
          where: { 
            id: $id 
          }
          data: { 
            usersUpvoted: { connect: { where: { id: $author } }}
            usersDownvoted: { disconnect:  { id: $author } }
          }
        ) {
          id
          usersDownvoted { id name email }
          usersUpvoted { id name email}
          title
          author{name id email posts {title id}}
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

  async downvotePost(args, context, executor) {
    const { id: postId } = args;
    const { id: personId } = context.user;

    const document = gql`
      mutation ($id: ID! $author: ID!) {
        updatePost(
          where: { 
            id: $id 
          }
          data: { 
            usersDownvoted: { connect: { where: { id: $author } }}
            usersUpvoted: { disconnect:  { id: $author } }
          }
        ) {
          id
          usersDownvoted { id name email }
          usersUpvoted { id name email}
          title
          author{name id email posts {title id}}
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
  }

  // ------------------------------- Deprecated -------------------------------

  async upvotePost1(args, context, info, schema) {
    const { id: postId } = args;
    const { id: personId } = context.user;
    const xxx = {
      where: {
        id: postId,
      },
      data: {
        usersUpvoted: { connect: { where: { id: personId } } },
      },
    };
    try {
      const x = await delegateToSchema({
        schema,
        operation: 'mutation',
        fieldName: 'updatePost',
        args: xxx,
        context,
        info,
      });
      return x;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async upvotePost2(args, context, info, schema, executor) {
    const postId = args.id;
    const votersId = context.user.id;

    const document = gql`
  query($votersId: ID!, $postId: ID!){
    bewertungs(where: {person: {id: $votersId}, post: {id: $postId}}) {
      id
    }
  }
  `;

    const response = await executor({ document, variables: { votersId, postId } });
    const { data, errors } = response;
    if (errors) throw new UserInputError(errors.map((e) => e.message).join('\n'));

    console.log(JSON.stringify(data));
    const bertungsId = data.bewertungs[0].id;
    const vote = {
      where: { id: bertungsId },
      upsert: {
        create:
        { person: { connect: { id: votersId } }, post: { connect: { id: postId } }, upvote: false },
        update:
        { person: { connect: { id: votersId } }, post: { connect: { id: postId } }, upvote: false },
      },
    };

    return delegateToSchema({
      schema,
      operation: 'mutation',
      fieldName: 'upsertBewertung',
      args: vote,
      context,
      info,
    });
  }

  /**
 * "Mutation failed due to permission errors, all changes will be rolled back"
 * Wir können keinen Zugriff für das Löschen erlangen. Daher haben wir diesen Teil, der
 * nur Optional Objectives
 */
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
}
