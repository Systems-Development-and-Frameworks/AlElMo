/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import { applyMiddleware } from 'graphql-middleware';
import datasource from './main/datasource';
import InMemoryDataSource from './main/InMemoryDataSource';
import resolvers from './resolver';
import typeDefs from './typeDefs';
import context from './context';
import Schema from './schema';

const { users, posts } = datasource;
const db = new InMemoryDataSource(users, posts);
const dataSources = () => ({ db });
// const context = ({ req, res }) => ({ req, res });
const opts = {
  settings: {
    'schema.polling.enable': false,
  },
};

(async () => {
  const schema = await Schema();
  const server = await new ApolloServer({
    schema,
    context,
    dataSources,
    opts,
  });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
})();
