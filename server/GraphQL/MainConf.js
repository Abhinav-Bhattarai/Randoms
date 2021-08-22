import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLSchema } = require('graphql');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        
    }
});

const MainSchema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

export default MainSchema;