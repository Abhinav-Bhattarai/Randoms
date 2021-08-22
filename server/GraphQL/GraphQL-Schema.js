import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { GraphQLObjectType, GraphQLString } = require('graphql');

export const UserSchema = new GraphQLObjectType({
    name: 'UserSchema',
    fields: () => {
        return {
            Username: { type: GraphQLString },
            CreationDate: { type: GraphQLString },
            _id: { type: GraphQLString }
        }
    }
});