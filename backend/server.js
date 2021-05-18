const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema")
const graphqlResolvers = require("./graphql/resolvers")
const passport = require('passport');
const {ApolloServer, gql} = require('apollo-server');
//const { ApolloServer } = require('apollo-server-express');
const path = '/graphql';
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const group = require('./routes/api/group');
const billtransactions = require('./routes/api/billtransactions');

const app = express();
// const typeDefs = require('./schemas/typedefs/profile');
// const resolvers = require('./resolvers');

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

// connect to mongoDb using mongoose -- Connection pooling

mongoose
    .connect(db)
    .then(() => console.log("MongoDb connected"))
    .catch(err => console.log(err));


//passport middleware
app.use(passport.initialize());

//passport config.
require('./config/passport')(passport);

//Use routes

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/group', group);
app.use('/api/billtransactions', billtransactions);


//The GraphQl Schema
const typeDefs = gql`
input Profile { 
    username: String,
    email: String,
    avatar: String,
    default_currency: String,
    timezone:String,
    phone: String,
    language: String,
}
type UpdatedProfile { 
    username: String,
    email: String,
    avatar: String,
    default_currency: String,
    timezone:String,
    phone: String,
    language: String,
}
type Query {
  updateprofile: [UpdatedProfile]
  }
type Mutation{
  saveProfile(updateprofile:Profile):UpdatedProfile
}
`;

const updateprofile = [];

//A map of functions which return data for the schema
const resolvers = {
  Query:{
    updateprofile:async()=>{
      return updateprofile;
    },
  },
  Mutation:{
    // addUser: async(parent,{user}, context) =>{
    //   const newUser = {...user, id:users.length};
    //   users.push(newUser);
    //   return newUser;
    // },
    // addOrder:async(parent, {itemId}, context)=>{
    //   const newOrder = {id: orders.length, userId:context.session.id, itemId};
    //   orders.push(newOrder);
    //   return newOrder;
    // },
    saveProfile:async(parent, {updateprofile}, context)=>{
      const updateProfile = {...updateprofile};
      updateprofile.push(updateProfile);
      return updateprofile;
    },
  },
};

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context:({req:Request}) =>{
//     return {session:{id:1}};
//   },
// });

app.use(
  "/",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true,
  })
)

const port = process.env.PORT || 4000;;

// app.listen({port:4000}).then(({url:String})=>{
// console.log(`Server ready at ${port}`);
// });
app.listen(port, () => console.log(`Server running on port ${port}`))