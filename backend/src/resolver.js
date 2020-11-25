export default {
  Query: {
    posts: (parent, args, context) => context.dataSources.db.posts,
    users: (parent, args, context) => context.dataSources.db.users,
  },
  Post: {
    author(parent, args, context) {
      return context.dataSources.db.users.find((user) => user.name === parent.author);
    },
  },
  User: {
    posts(parent, args, context) {
      return context.dataSources.db.posts.filter((post) => post.author === parent.name);
    },
  },

  Mutation: {
    write: (parent, args, context) => context.dataSources.db.createPost(args),
    delete: (parent, args, context) => context.dataSources.db.deletePost(args),
    upvote: (parent, args, context) => context.dataSources.db.upvotePost(args),
    downvote: (parent, args, context) => context.dataSources.db.downvotePost(args),
    signup: (parent, args, context) => context.dataSources.db.createUser(args),
    login: (parent, args, context) => context.dataSources.db.loginUser(args),
  },
};
