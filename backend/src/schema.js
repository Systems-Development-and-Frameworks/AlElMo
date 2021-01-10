import { applyMiddleware } from 'graphql-middleware';
import { stitchSchemas } from '@graphql-tools/stitch';
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
