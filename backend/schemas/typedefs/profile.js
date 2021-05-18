const {gql} = require('apollo-server');

module.exports = gql`
type Profile{
    _id: ID
    username: String
    email: String
    avatar: String
    default_currency: String
    timezone:String
    phone: String
    language: String
}

type Query{
    me: Profile
}
`;