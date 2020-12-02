import { mergeSchemas } from '@graphql-tools/merge';
import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'apollo-server';
import typeDefs from './typeDefs';
import resolvers from './resolver';
import permissions from './permissions';
import context from './context';
import datasource from './main/datasource';
import InMemoryDataSource from './main/InMemoryDataSource';

// import GraphCmsSchema from './graphCms/schema';
/*
const { users, posts } = datasource;
const db = new InMemoryDataSource(users, posts);
const dataSources = () => ({ db });

const opts = {
  settings: {
    'schema.polling.enable': false,
  },
}; */

export default async () => {
  let gatewaySchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  gatewaySchema = applyMiddleware(gatewaySchema, permissions);
  return gatewaySchema;
};
