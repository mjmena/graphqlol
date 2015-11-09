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
from './config';
import fetch from 'node-fetch';

function getChampion(id) {
  console.log("Getting Champion " + id)
  const query = 'https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/' + id + '?champData=info&api_key=' + API_KEY;
  return fetch(query)
    .then(function(res) {
      return res.json();
    }).then(
      function(json) {
        return json;
      });
}

function getSummoner(summoner) {
  console.log("Getting Summoner " + summoner)
  const query = 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summoner + '?api_key=' + API_KEY;
  return fetch(query)
    .then(function(res) {
      return res.json();
    }).then(
      function(json) {
        return json;
      });
}

function getEnemiesInMatch(match_id) {

  const query = 'https://na.api.pvp.net/api/lol/na/v2.2/match/' + match_id + '?api_key=' + API_KEY;
  return fetch(query)
    .then(function(res) {
      return res.json();
    }).then(
      function(json) {
        return json.participants.filter((participant) => {
          return participant.teamId === 200;
        }).map((participant) => {
          return getChampion(participant.championId);
        })
      });
}

function getCurrentMatch(summoner_id) {
  const query = 'https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/' + summoner_id + '?beginIndex=0&endIndex=1&api_key=' + API_KEY;
  return fetch(query)
    .then(function(res) {
      return res.json();
    }).then(
      function(json) {
        const match_id = json.matches[0].matchId;
        return getEnemiesInMatch(match_id);
      });
}

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

const Summoner = new GraphQLObjectType({
  name: 'Summoner',
  fields: (summoner) => ({
    id: {
      type: GraphQLID,
      resolve(root) {
        const key = Object.keys(root);
        return root[key].id;
      }
    },
    name: {
      type: GraphQLString,
      resolve(root) {
        const key = Object.keys(root);
        return root[key].name;
      }
    },
    enemies: {
      type: new GraphQLList(Champion),
      resolve(root) {
        const summoner_id = root[Object.keys(root)].id;
        return getCurrentMatch(summoner_id);
      }
    }
  })
})

const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    summoner: {
      type: Summoner,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(root, data) {
        return getSummoner(data.name);
      }
    },
  })
});

const schema = new GraphQLSchema({
  query: query
});

export default schema
