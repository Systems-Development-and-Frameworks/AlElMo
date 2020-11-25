/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import datasource from './main/datasource';
import InMemoryDataSource from './main/InMemoryDataSource';
import resolvers from './resolver';
import typeDefs from './typeDefs';

const { users, posts } = datasource;
const db = new InMemoryDataSource(users, posts);
const dataSources = () => ({ db });
const context = ({ req, res }) => ({ req, res });
const opts = {
  settings: {
    'schema.polling.enable': false,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  opts,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
