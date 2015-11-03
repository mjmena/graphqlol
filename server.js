import Hapi from 'hapi';
import {graphql} from 'graphql';
import {HOST, PORT} from './config';
import Schema from './Schema';

async function graphQLHandler(request, reply) {
  const {query, variables = {}} = request.payload;
  const result = await graphql(
    Schema,
    query,
    {
      db: request.db,
      userId: '1'
    },
    variables
  );
  return reply(result);
}

export default async function runServer() {
  try {
    const server = new Hapi.Server();

    server.connection({
      host: HOST,
      port: PORT
    });
    
    server.route({
      method: 'POST',
      path: '/',
      handler: graphQLHandler
    });

    server.start();

    console.log('Server started at ' + server.info.uri);
  } catch(e) {
    console.log(e);
  }
}
