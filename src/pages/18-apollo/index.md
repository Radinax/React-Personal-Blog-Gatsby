---
title: React with Apollo
date: "2020-04-18T11:53:32.169Z"
---

Apollo is a client that let us handle global state.

## Installing dependencies

    yarn add apollo-boost react-apollo graphql

Here’s an overview of the packages you just installed:

- apollo-boost offers some convenience by bundling several packages you need when working with Apollo Client:

- apollo-client: Where all the magic happens
- apollo-cache-inmemory: Our recommended cache
- apollo-link-http: An Apollo Link for remote data fetching
- apollo-link-error: An Apollo Link for error handling
- apollo-link-state: An Apollo Link for local state management
- graphql-tag: Exports the gql function for your queries & mutations
- react-apollo contains the bindings to use Apollo Client with React.
- graphql contains Facebook’s reference implementation of GraphQL - Apollo Client uses some of its functionality as well.

## How to use

We will use create-react-app and on the root we look for index.js file and add the client:

```javascript
import React from "react";
import { render } from "react-dom";
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import App from "./App";
import * as serviceWorker from './serviceWorker';

const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

It's very similar to what we did with Redux and the Provider

## How to do a Query

```javascript
import gql from 'graphql-tag'

export const GET_GAMES = gql`
  query getGames {
    allGames {
      title
      description
    }
  }
`
```

## How to CREATE

```javascript
import gql from 'graphql-tag'

export const CREATE_GAME = gql`
mutation CreateGame($title: String!, $description: String!){
  createGame(
    title: $title,
    description: $description
  ) {
    title
    description
  }
}`
```

## How to UPDATE

```javascript
import gql from 'graphql-tag'

export const UPDATE_GAME = gql`
mutation UpdateGame( $id: ID!, $title: String!, $description: String!) {
  updateGame(
    id: $id,
    title: $title,
    description: $description
  ) {
    id
    title
    description
  }
}`
```

## How to DELETE

```javascript
import gql from 'graphql-tag'

export const DELETE_GAME = gql`
mutation DeleteGame($id: ID!) {
  deleteGame(id: $id) {
    id
  }
}`
```

## How to apply queries and mutations in code

### READ

```javascript
...
import { useQuery } from '@apollo/react-hooks'
...

const { loading, error, data } = useQuery(GET_GAMES)
if (loading) return <div>LOADING</div>
if (error) return <div>There was an error: {error}</div>
return (
  {data.map(o => (
    <div key={o.title}>{o.title}</div>
  ))}
)
```

### CREATE

```javascript
...
import { useMutation } from '@apollo/react-hooks'
...

const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [createGame] = useMutation(CREATE_GAME, {
    refetchQueries: [ { query: GET_GAMES } ]
  })

const handleSubmit = () => {
  createGame({ variables: {title, description} })
}

return (
  <form onSubmit={handleSubmit}>
    <input type='text' value={title} onChange={e => setTitle(e.target.value)} />
    <input type='text' value={description} onChange={e => setDescription(e.target.value)} />
  </form>
)
```

We can perform similar codes for updating and deleting using the previous examples.

## Summary

- Call the ApolloProvider and add the client where we will put the url of the server.
- Make queries or mutations and use the respective hook to execute them.
- For updating and deleting, provide an ID.

## Conclusion

We applied the core concepts of Apollo in a simple manner performing a CRUD operation.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
