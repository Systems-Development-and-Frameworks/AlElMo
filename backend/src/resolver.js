export default ([{ schema, executor }]) => ({

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
    write:
    (parent, args, context, info) => context.dataSources.db.createPost(args, context, info, schema),
    delete: (parent, args, context, info) => context.dataSources.db.deletePost(args, context, info, schema),
    upvote: (parent, args, context, info) => context.dataSources.db.upvotePost1(args, context, info, schema),
    downvote: (parent, args, context) => context.dataSources.db.downvotePost(args, context, executor, schema),
    signup: (parent, args, context) => context.dataSources.db.createUser(args, context, executor),
    login: (parent, args, context) => context.dataSources.db.loginUser(args, context, executor),
  },
});
