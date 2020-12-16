import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'apollo-server';
import { fetch } from 'cross-fetch';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { stitchSchemas } from '@graphql-tools/stitch';
import { print } from 'graphql';
import { config as initEnv } from 'dotenv';
import typeDefs from './typeDefs';
import resolvers from './resolver';
import permissions from './permissions';

initEnv();
const { GRAPH_CMS_API_TOKEN, GRAPH_CMS_ENDPOINT } = process.env;

const executor = async ({ document, variables }) => {
  const query = print(document);
  const headers = { 'Content-Type': 'application/json' };
  if (GRAPH_CMS_API_TOKEN) headers.Authorization = `Bearer ${GRAPH_CMS_API_TOKEN}`;

  const fetchResult = await fetch(GRAPH_CMS_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  return fetchResult.json();
};
/*
export default async () => {
  let gatewaySchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  gatewaySchema = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  });
  // gatewaySchema = applyMiddleware(gatewaySchema, permissions);
  return gatewaySchema;
}; */

export default async () => {
  const gatewaySchemaAPI = wrapSchema({
    schema: await introspectSchema(executor),
    executor,
  });
  let gatewaySchema = stitchSchemas({
    subschemas: [
      gatewaySchemaAPI,
    ],
    resolvers,
    typeDefs,
  });
  gatewaySchema = applyMiddleware(gatewaySchema, permissions);
  return gatewaySchema;
};
