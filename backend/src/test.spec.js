import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import jwt from 'jsonwebtoken';
import InMemoryDataSource from './main/InMemoryDataSource';

import resolvers from './resolver';
import typeDefs from './typeDefs';

const jwtSign = (payload) => jwt.sign(payload, 'hahalul');

const getPost = ({
  id = '1', title = 'ABC', author = { id: '0' }, upvotes = [], downvotes = [],
} = {}) => {
  const data = {
    post: {
      title,
      author,
    },
  };
  return new Post(data, id)
    .setId(id)
    .setTitle(title)
    .setAuthor(author.id)
    .setUpvotes(upvotes)
    .setDownvotes(downvotes);
};

const getUser = ({ name = 'Al', password = '12345678' } = {}) => new User({ name, email: `${name}@example.com`, password }, InMemoryDataSource.getNewUserId());

const setupOneUserPost = () => {
  const user = getUser();
  const post = getPost({ author: user });
  const posts = [post];
  const users = [user];
  return {
    user, post, posts, users,
  };
};

const setupServer = (users, posts, context = () => ({ user: { id: null }, jwtSign })) => {
  const db = new InMemoryDataSource(users, posts);
  const dataSources = () => ({ db });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context,
  });
  const setAuthenticatedUser = ({ id } = null) => {
    server.requestOptions.context = () => ({ user: { id }, jwtSign });
  };
  return { ...createTestClient(server), db, setAuthenticatedUser };
};

const generateSignupMutation = (user) => `mutation { 
    signup (
      name:"${user.name}",
      email:"${user.email}",
      password:"${user.password}")
  }`;

const generateLoginMutation = (email, password) => `mutation { 
      login (
        email:"${email}",
        password:"${password}")
    }`;

describe('Testing Apollo Server', () => {
  it('Query: Receive one post, when asking for posts', async () => {
    const { users, posts } = setupOneUserPost();
    const { query } = setupServer(users, posts);

    const GET_POSTS = '{ posts { id, votes, title }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.posts.length).toEqual(1);
    expect(response.data.posts[0].id).toEqual('1');
    expect(response.data.posts[0].title).toEqual('ABC');
    expect(response.data.posts[0].votes).toEqual(0);
  });

  it('Query: Receive one user, when asking for users', async () => {
    const { users, posts } = setupOneUserPost();
    const { query } = setupServer(users, posts);

    const GET_POSTS = '{ users { name }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.users.length).toEqual(1);
    expect(response.data.users[0].name).toEqual('Al');
  });

  it('Query: Receive one user, their posts, the author of one of their post and the name of this author, when asking for users', async () => {
    const { users, posts } = setupOneUserPost();
    const { query } = setupServer(users, posts);

    const GET_POSTS = '{ users { name, posts {title, author{name}} }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.users.length).toEqual(1);
    expect(response.data.users[0].name).toEqual('Al');
  });

  it('Mutation: Create a post', async () => {
    const user = getUser();
    const posts = [];
    const users = [user];
    const { mutate, setAuthenticatedUser } = setupServer(users, posts);

    setAuthenticatedUser(user);

    const post = getPost(user);
    const CREATE_POST = `mutation { write(post: {title:"${post.title}"})
    { title, votes, author{name, posts{id}}, id}}`;
    const response = await mutate({ mutation: CREATE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.write.title).toEqual('ABC');
    expect(response.data.write.author.name).toEqual('Al');
  });

  it('Mutation: Delete a post', async () => {
    const {
      user, post, users, posts,
    } = setupOneUserPost();
    const { mutate, db, setAuthenticatedUser } = setupServer(users, posts);

    setAuthenticatedUser(user);

    const DELETE_POST = `mutation { delete(id: "${post.id}")
    { title, votes, author{name, posts{id}}, id}}`;
    expect(db.posts.length).toEqual(1);
    const response = await mutate({ mutation: DELETE_POST });
    expect(response.errors).toBeUndefined();
    expect(db.posts.length).toEqual(0);
    expect(response.data.delete.title).toEqual('ABC');
    expect(response.data.delete.title).toEqual('ABC');
    expect(response.data.delete.author.name).toEqual('Al');
  });

  it('Mutation: Upvote', async () => {
    const {
      user, post, users, posts,
    } = setupOneUserPost();
    const { mutate, setAuthenticatedUser } = setupServer(users, posts);

    setAuthenticatedUser(user);

    const UPVOTE_POST = `mutation {
      upvote (id:"${post.id}"){
         title, votes, author{name},
       }
     }`;
    const response = await mutate({ mutation: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
  });

  it('Mutation: Double Upvote from same user should not be double upvote', async () => {
    const {
      user, post, users, posts,
    } = setupOneUserPost();
    const { mutate, setAuthenticatedUser } = setupServer(users, posts);

    setAuthenticatedUser(user);

    const UPVOTE_POST = `mutation {
      upvote (id:"${post.id}"){
         title, votes, author{name}, id
       }
     }`;
    let response = await mutate({ mutation: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
    response = await mutate({ mutation: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
  });

  it('Mutation: Downvote', async () => {
    const {
      user, post, users, posts,
    } = setupOneUserPost();
    const { mutate, setAuthenticatedUser } = setupServer(users, posts);

    setAuthenticatedUser(user);

    const DOWNVOTE_POST = `mutation {
      downvote (id:"${post.id}"){
         title, votes, author{name}, id
       }
     }`;
    const response = await mutate({ mutation: DOWNVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.downvote.title).toEqual('ABC');
    expect(response.data.downvote.votes).toEqual(-1);
  });

  it('Mutation: First Upvote then Downvote from same user should overwrite the upvote and vote = -1', async () => {
    const {
      user, post, users, posts,
    } = setupOneUserPost();
    const { mutate, setAuthenticatedUser } = setupServer(users, posts);

    setAuthenticatedUser(user);

    const UPVOTE_POST = `mutation {
      upvote (id:"${post.id}"){
         title, votes, author{name}, id
       }
     }`;
    let response = await mutate({ mutation: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);

    const DOWNVOTE_POST = `mutation {
      downvote (id:"${post.id}"){
         title, votes, author{name}, id
       }
     }`;
    response = await mutate({ mutation: DOWNVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.downvote.title).toEqual('ABC');
    expect(response.data.downvote.votes).toEqual(-1);
  });

  it('Mutation: Signup new user with correct password length and no duplicate email should work', async () => {
    const user = getUser();
    const { mutate } = setupServer();
    const SIGN_UP = generateSignupMutation(user);
    const response = await mutate({ mutation: SIGN_UP });
    expect(response.errors).toBeUndefined();
    expect(typeof response.data.signup).toBe('string');
    expect(response.data.signup.match(/[^\S]+/)).toBeNull();
  });

  it('Mutation: Signup new user with incorrect password length but no duplicate email should not work', async () => {
    const user = getUser();
    user.password = '';
    const { mutate } = setupServer();
    const SIGN_UP = generateSignupMutation(user);
    const response = await mutate({ mutation: SIGN_UP });
    expect(response.errors).toBeTruthy();
    expect(response.errors[0].message).toMatch(/too.*short/i);
  });

  it('Mutation: Signup new user with duplicate email but correct password length should not work', async () => {
    const { user, users } = setupOneUserPost();
    const { mutate } = setupServer(users);
    const SIGN_UP = generateSignupMutation(user);
    const response = await mutate({ mutation: SIGN_UP });
    expect(response.errors).toBeTruthy();
    expect(response.errors[0].message).toMatch(/email.*taken/i);
  });

  it('Mutation: Signup new user with incorrect password length and duplicate email should not work', async () => {
    const user = getUser();
    user.password = '';
    const { mutate } = setupServer([user]);
    const SIGN_UP = generateSignupMutation(user);
    const response = await mutate({ mutation: SIGN_UP });
    expect(response.errors).toBeTruthy();
    expect(response.errors[0].message).toMatch(/email.*taken/i);
  });

  it('Mutation: Login known user with correct password should work', async () => {
    const password = 'haha lol you suck';
    const user = getUser({ password });
    const { mutate } = setupServer([user]);
    const LOG_IN = generateLoginMutation(user.email, password);
    const response = await mutate({ mutation: LOG_IN });
    expect(response.errors).toBeUndefined();
    expect(typeof response.data.login).toBe('string');
    expect(response.data.login.match(/[^\S]+/)).toBeNull();
  });

  it('Mutation: Login known user with incorrect password should not work', async () => {
    const password = 'haha lol you suck';
    const incorrectPassword = 'Ok Bro';
    const user = getUser({ password });
    const { mutate } = setupServer([user]);
    const LOG_IN = generateLoginMutation(user.email, incorrectPassword);
    const response = await mutate({ mutation: LOG_IN });
    expect(response.errors).toBeTruthy();
    expect(response.errors[0].message).toMatch(/wrong.*password/i);
  });

  it('Mutation: Login unknown user should not work', async () => {
    const password = 'haha lol you suck';
    const user = getUser({ password });
    const { mutate } = setupServer();
    const LOG_IN = generateLoginMutation(user.email, password);
    const response = await mutate({ mutation: LOG_IN });
    expect(response.errors).toBeTruthy();
    expect(response.errors[0].message).toMatch(/unknown.*user/i);
  });
});
