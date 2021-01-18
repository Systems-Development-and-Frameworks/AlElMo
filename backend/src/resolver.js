/* eslint-disable max-len */
export default ([{ schema, executor }]) => ({
  Post: {
    votes: {
      selectionSet: '{usersUpvoted{id} usersDownvoted{id}}',
      resolve: (post) => post.usersUpvoted.length - post.usersDownvoted.length,
    },
  },
  Mutation: {
    write: (parent, args, context, info) => context.dataSources.db.createPost(args, context, info, schema),
    delete: (parent, args, context, info) => context.dataSources.db.deletePost(args, context, info, schema),
    upvote: (parent, args, context, info) => context.dataSources.db.upvotePost(args, context, info, schema),
    downvote: (parent, args, context, info) => context.dataSources.db.downvotePost(args, context, info, schema),
    signup: (parent, args, context) => context.dataSources.db.createUser(args, context, executor, schema),
    login: (parent, args, context) => context.dataSources.db.loginUser(args, context, executor, schema),
  },
});
