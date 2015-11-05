import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
}
from 'graphql';
import {
  API_KEY
}
from './config.js';
import fetch from 'node-fetch';

const Champion = new GraphQLObjectType({
  name: 'Champion',
  fields: () => ({
    id: {
      type: GraphQLID
    },
    name: {
      type: GraphQLString
    },
    title: {
      type: GraphQLString
    }
  })
});

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    champion: {
      type: Champion,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(root, data) {
        return fetch('https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + data.id + '?champData=info&api_key=' + API_KEY)
          .then(function(res) {
            return res.json();
          }).then(function(json) {
            return json;
          });
      }
    },
  })
});

const schema = new GraphQLSchema({
  query: query
});

export default schema
