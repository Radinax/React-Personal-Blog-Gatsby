---
title: MERN Social Network - Server part 1
date: '2020-05-05T11:53:32.169Z'
---

In these series of posts we will learn how to build a social network from scratch, we can login using json web token, create a user profile, edit it, delete it, post comments in a feed, delete your comments, you can comment other people comments. This will provide for a complete experience of the stack.

This is the link of the [project](https://github.com/Radinax/mern-social-network) we will be using to learn about this stack.

## Folder Structure

```bash
├── config
│   ├── key.js
│   └── passport.js
├── models
│   ├── Posts.js
│   ├── Profile.js
│   └── User.js
├── routes
|   └── api
|       ├── user.js
|       ├── profile.js
|       └── post.js
├── validation
│   ├── education.js
│   ├── experience.js
|   ├── isEmpty.js
|   ├── login.js
|   ├── posts.js
|   ├── profile.js
│   └── register.js
└── server.js
```

## Setup MongoDB with mLab

[mLab](https://mlab.com/) it's a Database as a Service for MongoDB, we can use the free account for this project. Now signup or login, click

- AWS free sandbox account and we choose a region. Then we can assign it a name and we create it.
- Click on the DB name, now create a database user for this project and register your name (different from your mLab).
- Take the string given to you and use it in your app.

## Setup App

- npm init.
- yarn add express mongoose passport passport-jwt jsonwebtoken body-parser bcryptjs validator gravitar
- yarn add --dev nodemon
- Create server.js file
- Configure Nodemon in package.json like in our previous posts.

Let's create our server.js file, we import express and use it to instantiate the GET request and the port.

```javascript
const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello'))

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
```

Do yarn server to run your app.

## Connect our server to Mongo

Inside config/key.js

```javascript
module.exports = {
  mongoURI:
    'mongodb://Adrian:AdrianPassword123@ds157956.mlab.com:57956/socialnetwork',
}
```

Now in your server.js file we connect our express app with MongoDB:

```javascript
const express = require('express')
const mongoose = require('mongoose')

const app = express()

// DB CONFIG
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
```

Run yarn server and it will show **'MongoDB connected'**

## Building our resources

```javascript
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// Body  Parser middleware
// bodyParser let us handle JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// DB CONFIG
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello'))

// Use Routes
// These are our endpoints
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
```

Now on our routes/api/users.js we configure the other parts of the EP, in this case when we go to https://localhost:5000**/api/users/tests** we will get as a result "Users works".

```javascript
const express = require('express')
const router = express.Router()

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/tests', (req, res) =>
  res.json({
    msg: 'Users works',
  })
)

module.exports = router
```

Now on our profile.js

```javascript
const express = require('express')
const router = express.Router()

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get('/tests', (req, res) =>
  res.json({
    msg: 'Profile works',
  })
)

module.exports = router
```

Now on our post.js

```javascript
const express = require('express')
const router = express.Router()

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get('/tests', (req, res) =>
  res.json({
    msg: 'Post works',
  })
)

module.exports = router
```

## Summary

- npm init.
- yarn add express mongoose passport passport-jwt jsonwebtoken body-parser bcryptjs validator gravitar
- yarn add --dev nodemon
- Create server.js file
- Configure Nodemon in package.json like in our previous posts.
- Inside our server.js we connect our mongoDB with our express app.
- Inside our routes/api we add all the endpoints we will use and test that they work.
- In our server file we request the exported values and we assign each a endpoint which we will use to provide data as service.

## Conclusion

We will go step by step in these series with a usual summary at the end, the idea is to get to know how to build a fullstack app step by step without hurry, we will eventually make it a step by step recreation at the end to make future applications much faster.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
