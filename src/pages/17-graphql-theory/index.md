---
title: GraphQL Theory
date: "2020-04-17T11:53:32.169Z"
---

GraphQL is a new API standard to provide an alternative to REST, it has been gaining popularity along the community and this series is meant to learn what makes it so good over REST.

## Why use GraphQL

- We get the precise data we want avoiding over and under fetching. With REST we need to create different end points (EP) like **/users/:id** to get the information of one user, but what if we don't need all the data that comes from that EP? That's where GraphQL shows its flexibility.

## Core Concepts

### Schema Definition Language (SDL)

The following is an example of SDL to define a type called Person:

```javascript
type Person {
  name: String!,
  age: Int!
}
```

Where you can define the data tyoe (String, Int, Bool) and you can add the **!** to say its required.

You can also relate two types:

```javascript
type Post {
  title: String!,
  author: Person!
}
```

And you need to relate both types by modifying Person:

```javascript
type Person {
  name: String!,
  age: Int!,
  posts: [Post!]!
}
```

We created a one to many relationship between Person and Post and made posts in Person an array of Post.

### Fetching Data with Queries

Instead of providing several EP so you can fetch information from them like you did with REST, now with GraphQL you have one EP.

#### Basic Query

Lets check a basic query:

```javascript
{
  allPersons {
    name
  }
}
```

Where **allPersons** is the root field of the query and everything that follows is the payload of the query, the response would be:

```javascript
{

  "allPersons": [
    { "name": "Adrian" },
    { "name": "Alberto" },
    { "name": "Carlos" }
  ]
}
```

If you add age to the query you get the response with the age inside each object.

#### Queries with Arguments

```javascript
{
  allPersons(last: 2) {
    name
  }
}
```

This time you add a "last" parameter to return a specific number of persons. This is defined in the **schema** (we will check this later).

#### CRUD with Mutations

Well... disregarding the R which means read, we can create, update and delete data.

For creating:

```javascript
mutation {
  createPerson(name: "Bob", age: 20) {
    name
    age
  }
}
```

This time the **root field is createPerson**, and the response to the server would look like:

```javascript
"createPerson": {
  "name": "Bob",
  "age": 20
}
```

For updating:

```javascript
mutation {
  updatePerson(id: 1) {
    id
  }
}
```

For delete:

IN PROGRESS

### Realtime updates with Subscription

Instead of the typical request-response cycle from mutations and queries, you can send streams of data at real time.

```javascript
subscription {
  newPerson {
    name
    age
  }
}
```

When a new mutation is performed that creates a new Person, the server sends the information to the client.

### Defining a Schema

A Schema specifies the capacity of the API and defines how the client can request the data, its a collection of GraphQL types.

To write thhem you need to define the root types:

```javascript
type Query { ... }
type Mutation { ... }
type Subscription { ... }
```

To enable the codes we wrote before we define the schema:

```javascript
type Query {
  allPersons(last: Int): [Person!]!
}
type Mutation {
  createPerson(name: String!, age: Int!): Person!
}
type Subscription {
  newPerson: Person!
}

type Person {
  name: String!
  age: Int!
  posts: [Post!]!
}
type Post {
  title: String!
  author: Person!
}
```

## Architecture

There are three cases:

1. GraphQL server with a connected database

When query arrives to server it gets read and fetches the required information from the database, this is called **resolving** the query. You can use a network protocol like TCP, WebSockets, etc. You can also use the database of your choice.

2. GraphQL layer that integrates existing systems

You can connect a legacy system, microservice and third-party API to graphQL, this way new clients can connect to this GraphQL server to fetch the data they need, it would connect those three systems to the client.

3. Connected database and integration of existing system

When a query reach the server it will resolve and retrieve the required data from the database or the integrated API.

## Resolver Functions

Its purpose is to fetch the data for its field. When a server receives the query it will call all the functions for the fields that are specified in the query's payload, once all resolvers returned, the server will pack the data in the format described by the query and send it back to the client

If the query is:

```javascript
query {
  User(id: 120) {
    name
    followers(first: 5) {
      name
      age
    }
  }
}
```

The resolvers would be:

```javascript
User(id: String!): User
name(user: User!): String
age(user: User!): Int
friends(first: Int, user: User!): [User!]!
```

## GraphQL Client Libraries

Lets see the steps a REST API has to go through:

1. Construct and send HTTP request.
2. Receive and parse server response.
3. Store data locally (in memory or persistent).
4. Display data in UI.

What GraphQL will offer:

1. Describe data requirement.
2. Display data in UI.

## Client Concepts

### Infrastructure Features

- send queries and mutations directly without constructing HTTP requests
- view-layer integration
- caching
- validation and optimization of queries based on the schema

### Caching Results

Caching information locally is essential to provide a fluent UX, the idea is to put the information into a local store, we can use Apollo (the state management we will use instead of Redux).

## Server Concepts

Lets review once again the schema and how resolvers execute each field:

```javascript
type Query {
  author(id: ID!): Author
}

type Author {
  posts: [Post]
}

type Post {
  title: String
  content: String
}
```

Lets check the query we're sending:

```javascript
query {
  author(id: "abc") {
    posts {
      title
      content
    }
  }
}
```
Every field in the query can be associated with a type:

```javascript
query: Query {
  author(id: "abc"): Author {
    posts: [Post] {
      title: String
      content: String
    }
  }
}
```

### Reusability with Fragments

They're a colleection of fields on a specific type.

If we have the following type:

```javascript
type User {
  name: String!
  age: Int!
  email: String!
  street: String!
  zipcode: String!
  city: String!
}
```

We can turn it into a fragment:

```javascript
fragment addressDetails on User {
  name
  street
  zipcode
  city
}
```
You can now write this as:

```javascript
{
  allUsers {
    ... addressDetails
  }
}
```

### Parametrizing Fields with Arguments

Lets consider these Schemas:

```javascript
type Query {
  allUsers: [User!]!
}

type User {
  name: String!
  age: Int!
}
```

We can pass an argument like:

```javascript
type Query {
  allUsers(olderThan: Int = -1): [User!]!
}
```

And the query would look like:

```javascript
{
  allUsers(olderThan: 30) {
    name
    age
  }
}
```

### Naming Query Results with Aliases

We can do:

```javascript
{
  first: User(id: "1") {
    name
  }
  second: User(id: "2") {
    name
  }
}
```

Which translates to:

```javascript
{
  "first": {
    "name": "Alice"
  },
  "second": {
    "name": "Sarah"
  }
}
```


## Summary

- GraphQL is a standard in designing API's.
- You can use queries for fetching and mutations for creating, editing and deleting.
- A Schema specifies the capacity of the API and defines how the client can request the data.
- A resolver function will call all the functions for the fields that are specified in the query's payload.

## Conclusion

We are starting to learn about GraphQL, its the new concept that's being hyped up as a better alternative to REST due to avoid over fetching information you don't need.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
