---
title: Node Express MongoDB simple CRUD
date: "2020-05-02T11:53:32.169Z"
---

In this post we will focus on learning how to make a simple CRUD server. REST APIs involve a method of communication where we request an information and obtain a result, this can be translated into different methods like GET, POST, PUT and DELETE, for learning purpose we will make a simple case.

This is the link of the [project](https://github.com/Radinax/node-express-mongodb--starwars-crud) we will be using to learn about this stack.

## Folder Structure

- public
    - main.js
- views
    index.ejs
- server.js

Public contains simple DOM manipulation functions to update the view of the user.

View contains the "html" in [ejs format](https://ejs.co/) which is just template html for writing functions inside html kinda like how we do in React.

Now let's check our server file.

## Disecting the server

Let's start with the libraries:

```
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
```

- [express](https://expressjs.com/es/) is a Node JS Framework that provides a layer with functions that help build an application faster.
- [bodyParser](https://www.npmjs.com/package/body-parser) is a middleware that let us methods like urlencoded to parse the data to the body property in the request object.
- [MongoClient](https://www.mongodb.com) is a general purpose, document-based, distributed database built for modern application developers and for the cloud era. 

Now let's check how to connect to mongoDB using Mongo Atlas:

- First create an account [here](https://www.mongodb.com/download-center), then create an "Organization".
- Select your cloud service, it will be MongoDB Atlas in this case.
- Create a new project and name it anything you want.
- Then you can add members if needed.
- Click on Build a Cluster and eventually you get to a screen where you need to wait ~5 minutes for the it to be created.
- Click **connect** and when the modal pops whitelist your IP.
- Create a MongoDB user which is different from the username and password used for MongoDB Atlas, this particular username and password is used ONLY for the database.
- Connect your application and copy the link you just got.

Add the following variable to your server file.

```
const connectionString = 'mongodb+srv://username:password@cluster0-7rpdc.mongodb.net/test?retryWrites=true&w=majority'
```

Replacing the username and password with your own.

Now we will check how to use MongoClient:

![code](mongo-crud.png)

Where the methods we use in your db.collection can be found in [MongoDB documentation](https://docs.mongodb.com/manual/reference/method/js-collection/).

As we see it's a simple case of creating an instance of db.collection and use the different methods associated with it to perform CRUD operations as needed.

We won't go over the EJS file since it's pretty self explanatory and we won't use it for more projects.

## Summary

- We start by adding express, body-parser, mongodb and nodemon.
- We create a project in MongoDB and get our link to perform CRUD operations.

## Conclusion

The objective of this post was to learn how to perform CRUD operations using Node, Express and MongoDB. It's a simple case of getting the connectionString and making an instance of the client.db.collection to perform the respective methods from the server to the database.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
