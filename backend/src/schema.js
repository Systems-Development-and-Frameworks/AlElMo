import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'apollo-server';
import { fetch } from 'cross-fetch';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { print } from 'graphql';
// import { config as initEnv } from 'dotenv';
import typeDefs from './typeDefs';
import Resolvers from './resolver';
import permissions from './permissions';
import GraphCmsSchema, { executor } from './CmsSchema';

export default async () => {
  const graphcmsSchema = await GraphCmsSchema();
  const resolvers = Resolvers([{ schema: graphcmsSchema, executor }]);
  let gatewaySchema = stitchSchemas({
    subschemas: [
      graphcmsSchema,
    ],
    resolvers,
    typeDefs,
  });
  gatewaySchema = applyMiddleware(gatewaySchema, permissions);
  return { Schema: gatewaySchema, graphcmsSchema };
};
