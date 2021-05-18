const { buildSchema } = require("graphql")

module.exports = buildSchema(`

  type Profile {
    _id: ID
    username: String
    email: String
    avatar: String
    defaultCurrency: String
    timezone:String
    phone: String
    language: String
    created_at: String
    updated_at: String
  }

  type Member {
    member: ID
    isProcessed: String
    isAccepted: String
  }

  type BillMember {
    member: ID
    credit: Float
  }
  type Group {
    _id: ID
    adminId: String
    groupName: String
    groupAvatar: String
    created_at: String
    updated_at: String
    members: [Member]

  }

  type BillTransactions {
    _id: ID
    members: [BillMember]
    authorId: String
    groupName: String
    expenseDesc: String
    expenseAmount: Float
    created_at: String
    updated_at: String
  }

  type CurrencyProfile{
    email: String
    defaultCurrency: String
  }

  input CurrencyProfileInput {
    email: String
    defaultCurrency: String
  }

  input EmailProfileInput {
    email: String
  }

  input ProfileInput {
    handle: String!
    username: String
    email: String
    avatar: String
    defaultCurrency: String
    timezone:String
    phone: String
    language: String
  }

  input CreateGroupInput {
    ownerId: String
    groupName: String
    emails: [String]
  }

  input acceptInviteInput {
    member: String
    groupName: String
  }

  input addBillInput {
    member: String
    groupName: String
    expenseName: String
    expense: Float
  }

  type Query {
    profile:[Profile!]
    getProfile(profile:EmailProfileInput): Profile
    getGroup(email:EmailProfileInput):Group
  }

  type Mutation {
    updateProfile(profile:ProfileInput): Profile
    updateDefaultCurrency(profile:CurrencyProfileInput): CurrencyProfile
    createGroup(group:CreateGroupInput): Group
    acceptInviteGroup(group:acceptInviteInput): Group
    addBill(group: addBillInput): BillTransactions
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)