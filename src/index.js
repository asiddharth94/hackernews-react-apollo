import React from "react";
import ReactDOM from "react-dom";

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AUTH_TOKEN } from "./constants/constants";

// We create the httpLink that will connect our ApolloClient instance with the GraphQL API.
// The GraphQL server will be running on http://localhost:4000 (updated to heroku-url after deployment).
const httpLink = createHttpLink({
  uri: "https://hackernews-apollo-server-gql.herokuapp.com/",
});

/* Since all the API requests are actually created and sent by the ApolloClient instance
 at the root of our app, we need to make sure it knows about the user’s token! 
 Luckily, Apollo provides a nice way for authenticating all requests by using the 
 concept of middleware, implemented as an Apollo Link.
 
 This middleware will be invoked every time ApolloClient sends a request to the server.
 Apollo Links allow us to create middlewares that modify requests before they are sent to 
 the server.*/

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  authLink.concat(httpLink)
);

// We instantiate ApolloClient by passing in the httpLink and a new instance of an InMemoryCache.
const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
