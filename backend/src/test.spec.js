import { createTestClient } from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server';
import InMemoryDataSource from './main/InMemoryDataSource';
import Post from './main/Post';
import User from './main/User';

import resolvers from './resolver';
import typeDefs from './typeDefs';

const context = ({ req, res }) => ({ req, res });

const getPost = (id = '1', title = 'ABC', author = 'Al', upvotes = [], downvotes = []) => {
  const data = {
    post: {
      title,
      author: {
        id: author,
      },
    },
  };
  return new Post(data, id)
    .setId(id)
    .setTitle(title)
    .setAuthor(author)
    .setUpvotes(upvotes)
    .setDownvotes(downvotes);
};

const getUser = (name = 'Al') => new User({ name, email: `${name}@example.com`, password: '12345678' }, name)
  .setName(name);

const setupServer = (users, posts) => {
  const db = new InMemoryDataSource(users, posts);
  const dataSources = () => ({ db });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context,
  });
  return { ...createTestClient(server), db };
};

describe('Testing Apollo Server', () => {
  it('Query: Receive one post, when asking for posts', async () => {
    const posts = [getPost()];
    const users = [getUser()];
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
    const posts = [getPost()];
    const users = [getUser()];
    const { query } = setupServer(users, posts);

    const GET_POSTS = '{ users { name }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.users.length).toEqual(1);
    expect(response.data.users[0].name).toEqual('Al');
  });

  it('Query: Receive one user, their posts, the author of one of their post and the name of this author, when asking for users', async () => {
    const posts = [getPost()];
    const users = [getUser()];
    const { query } = setupServer(users, posts);

    const GET_POSTS = '{ users { name, posts {title, author{name}} }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.users.length).toEqual(1);
    expect(response.data.users[0].name).toEqual('Al');
  });
  it('Mutation: Upvote', async () => {
    // Setup Server

  it('Mutation: Create a post', async () => {
    const posts = [];
    const users = [getUser()];
    const { mutate } = setupServer(users, posts);

    const post = getPost();
    const CREATE_POST = `mutation { write(post: {title:"${post.title}"})
    { title, votes, author{name, posts{id}}, id}}`;
    const response = await mutate({ mutation: CREATE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.write.title).toEqual('ABC');
    expect(response.data.write.author.name).toEqual('Al');
  });

  it('Mutation: Delete a post', async () => {
    const post = getPost();
    const user = getUser();
    const posts = [post];
    const users = [user];
    const { mutate, db } = setupServer(users, posts);

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
    const post = getPost();
    const user = getUser();

    const posts = [post];
    const users = [user];
    const { mutate } = setupServer(users, posts);

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
    const post = getPost();
    const user = getUser();

    const posts = [post];
    const users = [user];
    const { mutate } = setupServer(users, posts);

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
    const post = getPost();
    const user = getUser();

    const posts = [post];
    const users = [user];
    const { mutate } = setupServer(users, posts);

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
    const post = getPost();
    const user = getUser();

    const posts = [post];
    const users = [user];
    const { mutate } = setupServer(users, posts);

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
});
