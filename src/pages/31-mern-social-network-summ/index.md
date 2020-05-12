---
title: MERN Social Network - Server Summary
date: '2020-05-12T11:53:32.169Z'
---

For this particular post I want to take the time to make a summary and a step by step instruction manual on how to do certain things we did when we built our server, they're patterns we will be using for our whole career and this post can be useful to people learning the stack.

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

## Configuration folder

The config folder has our Mongo URI key generated through mLabs which let us connect our app with mongoDB using:

```javascript
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
```

We also have the passport configuration which let us handle our authentication. This is rather mechanical as well:

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

Now everytime we need to login or use a private route we can use passport like:

```javascript
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

This way we can use a token from our login.

## Models folder

Models are Schemas which basically defines how data is organized and the relationship between them. Once defined it's imported into the API of each route.

Lets take Post as an example, a post will have the user id (info from the database), text, name, avatar, likes, comments and the current date.

Where comment and likes are their own little world, the first is an array of objects where each object (comment) has a user id, text, avatar, name and current date. While likes is just the user id.

In this case comment and like are childrens of post, each with their own ID generated in the database, this way we can target them easier when we want to delete them.

You can check the examples [here](https://github.com/Radinax/mern-social-network/tree/master/models).

## Routes

It defines how exactly each Endpoint will behave. Let's explore each route.

### Users

For Users we can register, login and GET our profile, the first two are public routes and the next one is private for when we're logged in.

For **register** it's a POST request so we need to validate our inputs, in our case name, email, password, confirm password, length of name, and if a input is required, while confirming both passwords are the same. Once this is done we take the requested data and add a new User model where we define the name, email, avatar and password, then we hash the password and save it in the database.

For **login** it's also a POST request, we need to validate the inputs, in this case email and password, compare the password we input with the one in the database and return a JWT token which we use for the user private routes.

For **current profile** it's a GET request where we use passport to authenticate and get as reponse our id, name and email.

### Profile

For profiles, a logged in user can look at its own profile (which is empty if it's a new account), we can create/edit/delete profiles, add/remove experience, education, while any user can check public profiles and individual ones as well with limited information.

For **profiles** we can check them when we're logged in (we need to authenticate with passport), we can populate it using another collection, in this case user, and obtain the name and avatar, with that we can get the profile. For creating one there are several fields like handle, company, website, location, bio, status, githubUsername, social media (youtube, instagram, twitter, facebook, linkedin), once they're all validated we can update one or create a new Profile. For delete we need to authenticate and find the Profile by ID and use the mongoose method to remove.

For **education and experience** which are children of profile, we need to be authenticated with passport and just send a new education/experience with the proper validation of each input. For deleting we need to get the experience/education ID of the profile, which is generated in the database, once we get it we need to use javascript to remove it from the array of objects.

### Posts

In the case of Posts we need both the Post and Profile model. We can make posts, which can have comments and one like for each user (including its own), a public user can see all posts including individual ones, but only a logged in user can make posts, comments or like a post.

For **Posting** user needs to be authenticated with passport and validate each input which is basically the text, we send the text, name, avatar and user id and save this in a new collection. For deleting a post we need to find the profile ID and then the post ID, then we can remove it.

For **comments** we need to authenticate using passport, then get the Post ID, make the respective validations and post a new comment which will contain a text, name, avatar and the user id, you add this to the comments array inside the Post using unshift or push. For removing a comment we need to handle two params, first we authenticate, then find the Post id using the first param, then check if the comment inside post exists, once we know it does, we can then use the second param to remove it from the array of objects (**Post**)

For **likes** we need to authenticate with passport, then get the Profile of the user using its ID and then get the post ID so we can add an object (like) to the likes array, which is a children of post, same as comments. For removing a like it's the same thing, except we remove the like from the array using javascript.

## Conclusion

The objective of this post was to summarize in words what we did in the past six posts, basically translating the code into logic we can use for future projects. So far Backend development is more on the repetitive side, its to note that Mongoose helps a lot with its methods, I need to repeat this same project using MySQL and PostgreSQL to see the difference, since in my past jobs the prefered database was Postgre.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
