const { createTestClient } = require('apollo-server-testing');
const { ApolloServer, gql } = require('apollo-server');

const resolvers = require('./resolver.js');
const typeDefs = require('./typeDefs.js');

const server = new ApolloServer({ typeDefs, resolvers });

const { query, mutate } = createTestClient(server);

query({
  query: books,
  variables: { id: 1 }
});

mutate({
  mutation: UPDATE_USER,
  variables: { id: 1, email: 'nancy@foo.co' }
});

// const { createTestClient } = require('apollo-server-testing');

it('fetches single launch', async () => {
  const userAPI = new UserAPI({ store });
  const launchAPI = new LaunchAPI();

  // create a test server to test against, using our production typeDefs,
  // resolvers, and dataSources.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ userAPI, launchAPI }),
    context: () => ({ user: { id: 1, email: 'a@a.a' } })
  });

  // mock the dataSource's underlying fetch methods
  launchAPI.get = jest.fn(() => [mockLaunchResponse]);
  userAPI.store = mockStore;
  userAPI.store.trips.findAll.mockReturnValueOnce([
    { dataValues: { launchId: 1 } }
  ]);

  // use the test server to create a query function
  const { query } = createTestClient(server);

  // run query against the server and snapshot the output
  const res = await query({ query: GET_LAUNCH, variables: { id: 1 } });
  expect(res).toMatchSnapshot();
});
