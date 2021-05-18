const { buildSchema } = require("graphql")

module.exports = buildSchema(`

  type Profile {
    _id: ID
    username: String
    email: String
    avatar: String
    default_currency: String
    timezone:String
    phone: String
    language: String
    createdAt: String
    updatedAt: String
  }

  type CurrencyProfile{
    email: String
    default_currency: String
  }

  input CurrencyProfileInput {
    email: String
    default_currency: String
  }

  input ProfileInput {
    handle: String!
    username: String
    email: String
    avatar: String
    default_currency: String
    timezone:String
    phone: String
    language: String
  }

  type Query {
    profile:[Profile!]
  }

  type Mutation {
    updateProfile(profile:ProfileInput): Profile
    updateDefaultCurrency(profile:CurrencyProfileInput): CurrencyProfile
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)