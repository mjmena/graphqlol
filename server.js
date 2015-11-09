import Hapi from 'hapi';
import {
  graphql
}
from 'graphql';
import {
  HOST, PORT
}
from './config';
import schema from './schema';

function graphQLHandler(request, reply) {
  const {
    query, variables = {}
  } = request.payload;
  const result = graphql(
    schema,
    query, {
      db: request.db,
      userId: '1'
    },
    variables
  );
  return reply(result);
}

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

// server.start(() => console.log('Server started at ' + server.info.uri))

graphql(schema, `{
  summoner(name:\"mjxm\") {
    id,
    name,
    enemies{
      name,
      title
    }
  }
}`, {}).then((result) => {
  console.log(result)
  console.log(result.data.summoner.enemies);
});
