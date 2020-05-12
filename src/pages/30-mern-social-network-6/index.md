---
title: MERN Social Network - Server part 6 Comments and likes
date: '2020-05-11T11:53:32.169Z'
---

In this post we will work on adding the post comments.

## Post model

Inside models/Post.js, we want to add the avatar and the name. The idea is that if the user deletes his profile, we don't want their posts to be deleted as well. We want each like to be linked with the user as well so they don't hit the like button more than once.

```javascript
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const PostSchema = newSchema({
  user: {
    type: Schema.Types.ObjectId,
    refs: 'users',
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        refs: 'users',
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        refs: 'users',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = Post = mongoose.model('post', PostSchema)
```

We have user associated with posts, we have likes and comments.

## Post routes API

Inside routes/api/posts.js

```javascript
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

// Post model
const Post = require('../../models/Post')

// Validation
const validatePostInput = require('../../validation/post')

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get('/tests', (req, res) =>
  res.json({
    msg: 'Post works',
  })
)

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body)

    // Check Validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors)
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id,
    })

    newPost.save().then(post => res.json(post))
  }
)

module.exports = router
```

For our validation create inside validation/post.js

```javascript
const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validatePostInput(data) {
  let errors = {}

  data.text = !isEmpty(data.text) ? data.text : ''

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters'
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
```

To test it we login as usual in api/user/login with your email and password, take the token and then go to api/posts put it in the headers and add a text value in the body and we get our post back.

Now we need to set the routes for all comments and to single out a specific comment.

## GET all posts

Inside the same routes/api/posts:

```javascript
// @route  GET api/posts
// @desc   GET posts
// @access Public
router.get('/', (req, res) => {
  Post.find()
    .sort({date: -1})
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(noPostFound:'No posts found'))
})
```

Since its public you don't need to login, so make a GET request to api/posts to obtain all the posts.

## GET single post

```javascript
// @route  GET api/posts/:id
// @desc   GET post by id
// @access Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(noPostFound:'No post found with that id'))
})
```

Grab an id from one of the posts and add it to api/post/:id where :id is the value you copied.

## DELETE post

This is going to be private now:

```javascript
// Profile model
const Profile = require('../../models/Profile')
// @route  DELETE api/posts/:id
// @desc   Delete post
// @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ noAuthorize: 'User not authorized' })
            // 401 is non authorized
          }

          // Delete
          post.remove().then(() => res.json({ success: true }))
        })
        .catch(err => res.status(404).json({ postNotFound: 'No post found' }))
    })
  }
)
```

To try this delete the post you created the last time, so take that id, make a DELETE request in api/posts/:id, remember to login!

Now in GET api/posts check to see if it was deleted.

## Likes route

For this route we will make it possible for the user to like a post and remove the like if he wants.

```javascript
// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private
router.delete(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alredyLiked: 'User alredy liked this post' })
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id })

          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postNotFound: 'No post found' }))
    })
  }
)
```

Test it in api/posts/like/:id, where :id is the one from any post. The result will be an array of objects with each like having its own ID and user ID

## Remove like

```javascript
// @route  POST api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.delete(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: 'You have not yet like this post' })
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.String())
            .indexOf(req.user.id)

          // Splice out of array
          post.likes.splice(removeIndex, 1)

          // Save
          post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postNotFound: 'No post found' }))
    })
  }
)
```

Now go to api/posts/unlike/:id where :id is the post id.

## Add comments

We can use the same posts validation here since we only need to validate the text.

In the same routes/api/posts

```javascript
// @route  POST api/posts/comment/:id
// @desc   Add comment to post
// @access Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        const { errors, isValid } = validatePostInput(req.body)

        // Check Validation
        if (!isValid) {
          // if any errors, send 400 with errors object
          return res.status(400).json(errors)
        }

        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id,
        }

        // Add to comments array
        post.comments.unshift(newComment)

        // Save
        post.save().then(post => res.json(post))
      })
      .catch(err => res.status(404).json({ postNotFound: 'No post found' }))
  }
)
```

Now go to api/posts/comment/:id where :id is the post id, add the token to headers and in the body add a text field.

## Delete comment

```javascript
// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', {session: false}), (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      // Check to see if the comment exists
      if(posts.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
        return res.status(404).json({commentNotExist: 'Comment does not exist'})
      }

      // Get remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id)

      // Splice comment out of array
      post.comments.splice(removeIndex, 1)

      post.save().then(post -> res.json(post))
    })
    .catch(err => res.status(404).json({postNotFound: 'No post found'}))
})
```

Now go to to api/posts/comment/:id/:comment_id where :id is the post id and the other id is the comment one, then perform the DELETE request.

## Summary

- We added the POST models and routes.
- User can create posts now with its respective validation.
- User can GET all posts and a single post by id.
- User can delete its own posts.
- User can like/unlike posts.
- User can add/remove comments

## Conclusion

For this part of the series we added the functionality for the users to create posts, comments, and like/unlike posts, along with deleting posts and comments.

This is it for the server section, now we will go to the frontend with React to make use of the server we just created to feed the client.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
