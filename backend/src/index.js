// init DB
import { InMemoryDataSource } from './db';
const { Posts, Users } = require('./datasource');
const db = new InMemoryDataSource(Posts, Users);
const dataSources = () => ({ db });

// Server
const { ApolloServer } = require('apollo-server');

const context = ({ req, res }) => ({ req, res });

const resolvers = require('./resolver.js');

const typeDefs = require('./typeDefs.js');

const opts = {
  settings: {
    'schema.polling.enable': false
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  opts
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
