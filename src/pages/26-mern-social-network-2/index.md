---
title: MERN Social Network - Server part 2 Authentication
date: '2020-05-06T11:53:32.169Z'
---

In this post we will continue with the next part of our application which is authentication, which we covered using Prisma and Apollo with GraphQL using the same libraries, now we will apply the same knowledge with REST.

## Create users model

We will create a schema (similar to graphQL):

> A database schema is the skeleton structure that represents the logical view of the entire database. It defines how the data is organized and how the relations among them are associated. It formulates all the constraints that are to be applied on the data.

- models/User.js

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = User = mongoose.model('users', UserSchema)
```

## Using POSTMAN

This is a very valuable tool for testing your EPs provided to the client or service that wants to consume your API.

- Go to https://www.postman.com/ and download the app.
- Now on the GET input put the URL you want to test:

![code](mern-1.png)

And we see it works.

## Registration

Our next step is to add registration.

In routes/api/users.js

```javascript
const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('brypt')

// Load User model
const User = require('../../models/User')

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'Users works',
  })
)

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email alredy exists',
      })
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      })
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

module.exports = router
```

Now go to POSTMAN and make a POST request:

![code](mern-2.png)

## Login

Once the email and password are verified, they get as response a TOKEN, which we can use to access a protected route, for this we will use passport-jwt.

```javascript
const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('brypt')

// Load User model
const User = require('../../models/User')

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'Users works',
  })
)

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email alredy exists',
      })
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      })
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @route  GET api/users/login
// @desc   Login User / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({ email: 'User not found' })
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' })
      } else {
        return res.status(400).json({ password: 'Password incorrect' })
      }
    })
  })
})

module.exports = router
```

If we test it in POSTMAN forcing an error:

![code](mern-3.png)

If we input the correct data:

![code](mern-4.png)

Now that we know it works, we need for when we login we get a TOKEN.

## Handling TOKENS

Inside in our config/key.js we need to add a secret key in order to use JWT:

```javascript
module.exports = {
  mongoURI:
    'mongodb://Adrian:AdrianPassword123@ds157956.mlab.com:57956/socialnetwork',
  secretOrKey: 'secret',
}
```

Now in our user API:

```javascript
const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('brypt')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')

// Load User model
const User = require('../../models/User')

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'Users works',
  })
)

// @route  GET api/users/register
// @desc   Register user
// @access Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email alredy exists',
      })
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm', // Default
      })
      // new model Name
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

// @route  GET api/users/login
// @desc   Login User / Returning JWT Token
// @access Public
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password

  // Find user by email
  User.findOne({ email }).then(user => {
    // user is from DB
    // Check for user
    if (!user) {
      return res.status(404).json({ email: 'User not found' })
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
        }

        // Sign Token
        // Takes a Payload, key
        // It expires after certain time
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            })
          }
        )
      } else {
        return res.status(400).json({ password: 'Password incorrect' })
      }
    })
  })
})

module.exports = router
```

Now if we POST again we get a message with success and the token.

## Connecting PASSPORT

Inside server.js we add passport for authentication.

```javascript
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const posts = require('./routes/api/posts')

const app = express()

// Body  Parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// DB CONFIG
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

// Passport middelware
app.use(passport.initialize())

// Passport Config
require('./config/passport')(passport)

// Use Routes
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server running on port ${port}`))
```

Now create the config file:

```javascript
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
// This 'users' comes from the string in the model
const User = mongoose.model('users')
const keys = require('../config/keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretOrKey

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // This payload is the one we used in User Match
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch(err => console.log(err))
    })
  )
}
```

Now we need to create a protected route inside our user API:

```javascript
const passport = require('passport')

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    })
  }
)
```

Now to test everything works perform a POST request to login:

![code](mern-5.png)

With the token perform a GET request with the token in the headers getting as result:

![code](mern-6.png)

## Summary

- We perform authentication with JWT and Tokens.
- When user login we get a token which we use with a GET request to obtain the data we need.
- If we try this without token we get "UNAUTHORIZED" message.
- We created our Schema file.
- In our users API file we configured our endpoints, we import the schema (model), validate the email and then use bcrypt to hash the password.
- With the login EP we check if the email is valid and then we compare the password, once we got it we get a token.
- With said token we use passport, initialize it in our server file, then configure the authentication using the token in our configuration file, finally we use passport.authenticate to use that token to obtain the information we need after we login.

## Conclusion

For this part of the series we handled a good part of the authentication configuration. Using passport and bcrypt we managed to create a signup and login system.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
