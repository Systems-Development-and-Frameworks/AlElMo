/* eslint-disable no-console */
import { ApolloServer } from 'apollo-server';
import ResolverHandler from './ResolverHandler';
import context from './context';
import Schema from './schema';

const db = new ResolverHandler();
const dataSources = () => ({ db });
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
