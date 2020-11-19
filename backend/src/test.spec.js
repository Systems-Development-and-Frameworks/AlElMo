const { createTestClient } = require('apollo-server-testing');

const { ApolloServer } = require('apollo-server');
const { InMemoryDataSource } = require('./db');

const resolvers = require('./resolver.js');
const typeDefs = require('./typeDefs.js');

const context = ({ req, res }) => ({ req, res });

const getPost = (id = '1', title = 'ABC', votes = 0, author = 'Al', usersUpvoted = [], usersDownvoted = []) => {
  return {
    id,
    title,
    votes,
    author,
    usersUpvoted,
    usersDownvoted
  };
};

const getUser = (name = 'Al', posts = ['1']) => {
  return {
    name, posts
  };
};

const getQuery = (Posts, Users) => {
  const db = new InMemoryDataSource(Posts, Users);
  const dataSources = () => ({ db });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources,
    context
  });
  return createTestClient(server).query;
};

describe('Testing Apollo Server', () => {
  it('Query: Receive one Post, when asking for Posts', async () => {
    // Setup Server

    const Posts = [getPost()];
    const Users = [getUser()];
    const query = getQuery(Posts, Users);

    const GET_POSTS = '{ posts { id, votes, title }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.posts.length).toEqual(1);
    expect(response.data.posts[0].id).toEqual('1');
    expect(response.data.posts[0].title).toEqual('ABC');
    expect(response.data.posts[0].votes).toEqual(0);
  });
  it('Query: Receive one User, when asking for Users', async () => {
    // Setup Server

    const Posts = [getPost()];
    const Users = [getUser()];
    const query = getQuery(Posts, Users);

    const GET_POSTS = '{ users { name }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.users.length).toEqual(1);
    expect(response.data.users[0].name).toEqual('Al');
  });
  it('Query: Receive one User, their posts, the author of one of their post and the name of this author, when asking for Users', async () => {
    // Setup Server

    const Posts = [getPost()];
    const Users = [getUser()];
    const query = getQuery(Posts, Users);

    const GET_POSTS = '{ users { name, posts {title, author{name}} }}';

    const response = await query({ query: GET_POSTS });

    expect(response.errors).toBeUndefined();
    expect(response.data.users.length).toEqual(1);
    expect(response.data.users[0].name).toEqual('Al');
    expect(response.data.users[0].posts[0].title).toEqual('ABC');
    expect(response.data.users[0].posts[0].author.name).toEqual('Al');
  });
  it('Mutation: Create a post', async () => {
    // Setup Server

    const Posts = [];
    const Users = [getUser()];
    const query = getQuery(Posts, Users);

    const Post = getPost();
    const CREATE_POST = `mutation PostInput{ write(post: {title:"${Post.title}", author:{name:"${Post.author}"}})
    { title, votes, author{name, posts{id}}, id}}`;
    const response = await query({ query: CREATE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.write.title).toEqual('ABC');
    expect(response.data.write.author.name).toEqual('Al');
    // User should have the Post in his/her lists of posts
    console.log(response.data);
    expect(response.data.write.author.posts[0].id).toEqual(response.data.write.id);
  });
  it('Mutation: Upvote', async () => {
    // Setup Server

    const Post = getPost();
    const User = getUser();

    const Posts = [Post];
    const Users = [User];
    const query = getQuery(Posts, Users);

    const UPVOTE_POST = `mutation PostInput{
      upvote (id:"${Post.id}", voter: {name:"${User.name}"}){
         title, votes, author{name}, id, usersUpvoted
       }
     }`;
    const response = await query({ query: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
    expect(response.data.upvote.usersUpvoted[0]).toEqual('Al');
  });
  it('Mutation: Double Upvote from same User should not be double upvote', async () => {
    // Setup Server

    const Post = getPost();
    const User = getUser();

    const Posts = [Post];
    const Users = [User];
    const query = getQuery(Posts, Users);

    const UPVOTE_POST = `mutation PostInput{
      upvote (id:"${Post.id}", voter: {name:"${User.name}"}){
         title, votes, author{name}, id, usersUpvoted
       }
     }`;
    let response = await query({ query: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
    expect(response.data.upvote.usersUpvoted[0]).toEqual('Al');
    response = await query({ query: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
    expect(response.data.upvote.usersUpvoted[0]).toEqual('Al');
  });
  it('Mutation: Downvote', async () => {
    // Setup Server

    const Post = getPost();
    const User = getUser();

    const Posts = [Post];
    const Users = [User];
    const query = getQuery(Posts, Users);

    const DOWNVOTE_POST = `mutation PostInput{
      downvote (id:"${Post.id}", voter: {name:"${User.name}"}){
         title, votes, author{name}, id, usersDownvoted
       }
     }`;
    const response = await query({ query: DOWNVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.downvote.title).toEqual('ABC');
    expect(response.data.downvote.votes).toEqual(-1);
    expect(response.data.downvote.usersDownvoted[0]).toEqual('Al');
  });
  it('Mutation: First Upvote then Downvote from same User should overwrite the upvote and vote = -1', async () => {
    // Setup Server

    const Post = getPost();
    const User = getUser();

    const Posts = [Post];
    const Users = [User];
    const query = getQuery(Posts, Users);

    const UPVOTE_POST = `mutation PostInput{
      upvote (id:"${Post.id}", voter: {name:"${User.name}"}){
         title, votes, author{name}, id, usersUpvoted
       }
     }`;
    let response = await query({ query: UPVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.upvote.title).toEqual('ABC');
    expect(response.data.upvote.votes).toEqual(1);
    expect(response.data.upvote.usersUpvoted[0]).toEqual('Al');

    const DOWNVOTE_POST = `mutation PostInput{
      downvote (id:"${Post.id}", voter: {name:"${User.name}"}){
         title, votes, author{name}, id, usersDownvoted
       }
     }`;
    response = await query({ query: DOWNVOTE_POST });
    expect(response.errors).toBeUndefined();
    expect(response.data.downvote.title).toEqual('ABC');
    expect(response.data.downvote.votes).toEqual(-1);
    expect(response.data.downvote.usersDownvoted[0]).toEqual('Al');
  });
});
