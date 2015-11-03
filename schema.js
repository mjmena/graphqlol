import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList
} from 'graphql';

const User = new GraphQLObjectType({
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
    },
  })
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    champion: {
      type: Champion,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}, {rootValue: {db}}) {
        return db.get(`
          SELECT * FROM User WHERE id = $id
          `, {$id: id});
      }
    },
    story: {
      type: Story,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parent, {id}, {rootValue: {db}}) {
        return db.get(`
          SELECT * FROM Story WHERE id = $id
          `, {$id: id});
      }
    }
  })
});

const Schema = new GraphQLSchema({
  query: Query
});
export default Schema;
