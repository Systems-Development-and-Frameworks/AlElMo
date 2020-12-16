export default {
  Query: {
    // posts: (parent, args, context, info) =>
    // context.dataSources.db.getPosts(args, context, info, subschema),
    // persons: (parent, args, context) => context.dataSources.db.users,
  },
  Post: {
    votes: {
      selectionSet: '{usersUpvoted{id} usersDownvoted{id}}',
      resolve: (post) => post.usersUpvoted.length - post.usersDownvoted.length,
    },
  },
  Person: {
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
