export default {
  Query: {
    posts: (parent, args, context) => context.dataSources.db.posts,
    users: (parent, args, context) => context.dataSources.db.users,
  },
  Post: {
    author(parent, args, context) {
      return context.dataSources.db.users.find((user) => user.id === parent.author);
    },
  },
  User: {
    posts(parent, args, context) {
      return context.dataSources.db.posts.filter((post) => post.author === parent.id);
    },
  },

  Mutation: {
    write: (parent, args, context) => context.dataSources.db.createPost(args, context),
    delete: (parent, args, context) => context.dataSources.db.deletePost(args, context),
    upvote: (parent, args, context) => context.dataSources.db.upvotePost(args, context),
    downvote: (parent, args, context) => context.dataSources.db.downvotePost(args, context),
    signup: (parent, args, context) => context.dataSources.db.createUser(args, context),
    login: (parent, args, context) => context.dataSources.db.loginUser(args, context),
  },
};
