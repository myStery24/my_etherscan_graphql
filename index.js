// Import ApolloServer and schema importing utilities from apollo-server
const { ApolloServer } = require("apollo-server");
const { importSchema } = require("graphql-import");

// Import the data source class 
const EtherDataSource = require("./datasource/ethDatasource");

// Import the GraphQL schema from the schema file
const typeDefs = importSchema("./schema.graphql"); 

// Load environment variables from .env file
require("dotenv").config();

// Define the resolvers map
const resolvers = {
  Query: {
    // Resolver to get ether balance for an address
    etherBalanceByAddress: (root, _args, { dataSources }) =>  
      dataSources.ethDataSource.etherBalanceByAddress(),

    // Resolver to get total ether supply
    totalSupplyOfEther: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.totalSupplyOfEther(),

    // Resolver to get latest ethereum price
    latestEthereumPrice: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getLatestEthereumPrice(),

    // Resolver to get block confirmation time
    blockConfirmationTime: (root, _args, { dataSources }) =>
      dataSources.ethDataSource.getBlockConfirmationTime(),
  },
};

// Create ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  
  // Pass data sources 
  dataSources: () => ({
    ethDataSource: new EtherDataSource(), 
  }),
});

// Set timeout to 0
server.timeout = 0;

// Start the server
server.listen("9000").then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`); 
});