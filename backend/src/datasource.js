const User1 = {
  name: 'Al',
  posts: []
};
const User2 = {
  name: 'El',
  posts: []
};
const User3 = {
  name: 'Mo',
  posts: []
};

const Post1 = {
  id: '1',
  title: 'ABC',
  votes: 0,
  author: 'Al',
  usersUpvoted: [],
  usersDownvoted: []
};
const Post2 = {
  id: '2',
  title: 'DEF',
  votes: 0,
  author: 'El',
  usersUpvoted: [],
  usersDownvoted: []
};
const Post3 = {
  id: '3',
  title: 'GHI',
  votes: 0,
  author: 'Mo',
  usersUpvoted: [],
  usersDownvoted: []
};

exports.Users = [User1, User2, User3];
exports.Posts = [Post1, Post2, Post3];
