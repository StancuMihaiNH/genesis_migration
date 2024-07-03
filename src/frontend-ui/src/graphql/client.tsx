import React from "react";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});
export const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(
    `${process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY}`,
  );
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  cache: new InMemoryCache({}),
  link: authLink.concat(httpLink),
});

const GraphQLProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLProvider;
