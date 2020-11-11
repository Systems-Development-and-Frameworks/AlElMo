

const User1 = {
  name: "3asdasd",
  posts: [2]
};



var User2 = {
  name: "4asdasdasd",
  posts: [21]
};


const Post1 = {
  id: 2,
  title: "Hallo",
  votes: 2,
  author: "3asdasd"
};

const Posts = [
  Post1,
  {
    id: 21,
    title: "Hallo1",
    votes: 21,
    author: "4asdasdasd"
  },
];


const Users = [User1, User2];


module.exports = {
  Query: {
    posts: () => Posts,
    users: () => Users
  },
  Post: {
    author(parent) {
      return Users.find(user => user.name === parent.author);

    }
  },
  User: {
    posts(parent) {
      return Posts.filter(post => parent.posts.includes(post.id));
    }
  }
};

