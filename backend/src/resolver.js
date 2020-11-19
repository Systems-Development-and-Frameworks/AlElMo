module.exports = {
  Query: {
    posts: (parent, args, context) => context.dataSources.db.posts,
    users: (parent, args, context) => context.dataSources.db.users
  },
  Post: {
    author (parent, args, context) {
      return context.dataSources.db.users.find(user => user.name === parent.author);
    }
  },
  User: {
    posts (parent, args, context) {
      return context.dataSources.db.posts.filter(post => parent.posts.includes(post.id));
    }
  },

  Mutation: {
    write: (parent, args, context) => context.dataSources.db.createPost(args),
    upvote: (parent, args, context) => context.dataSources.db.upvotePost(args)
  }
};
