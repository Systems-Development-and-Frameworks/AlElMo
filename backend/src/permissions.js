import { ForbiddenError } from 'apollo-server';

import {
  rule, shield, allow, deny,
} from 'graphql-shield';

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, context) => !!context.userID,
);

const permissions = shield({
  Query: {
    '*': deny,
    posts: allow,
    users: allow,
  },
  Mutation: {
    '*': deny,
    login: allow,
    signup: allow,
    downvote: isAuthenticated,
    upvote: isAuthenticated,
    delete: isAuthenticated,
    write: isAuthenticated,
  },
}, {
  allowExternalErrors: true,
  fallbackRule: allow,
  fallbackError: new ForbiddenError('Not Authorised!'),
});

export default permissions;
