/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
// import datasource from './main/datasource';
import InMemoryDataSource from './main/InMemoryDataSource';
import context from './context';
import Schema from './schema';

// const { users, posts } = datasource;
const db = new InMemoryDataSource();
const dataSources = () => ({ db });
// const context = ({ req, res }) => ({ req, res });
const opts = {
  settings: {
    'schema.polling.enable': false,
  },
};

(async () => {
  const schema = (await Schema()).Schema;
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
