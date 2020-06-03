---
title: PERN Blog App - Server
date: '2020-06-03T11:53:32.169Z'
---

In our last post we talked extensively about PostgreSQL and Sequelize, this post will be about creating the server of our PERN application.

This is the link of the [project](https://github.com/Radinax/node-express-postgresql-sequelize-react-blog) we will be using to learn about this stack.

## Folder Structure

Our server will look like this when we're done.

```bash
|── controllers
|   └── index.js
|── database
|   └── config
|       └── config.js
|── migrations
|   |── xxx-create-user.js
|   |── xxx-create-post.js
|   └── xxx-create-comment.js
|── models
|   |── comment.js
|   |── index.js
|   |── post.js
|   └── user.js
|── seeders
|   |── xxx-User.js
|   |── xxx-Post.js
|   └── xxx-Comment.js
|── routes
|   └── index.js
|── server
|   └── index.js
|── .env
|── .sequelizerc
└── index.js
```

## Endpoints

These are the endpoints for reference, we be using all the profile ones

```bash
└── /api/users
              /register                         [POST]
              /login                            [POST]
              /current                          [GET]

└── /api/profile                                [GET] [POST] [DELETE]
              /all                              [GET]
              /handle/:handle                   [GET]
              /user/:user_id                    [GET]
              /experience                       [POST]
              /education                        [POST]
              /experience/:exp_id               [DELETE]
              /education/:edu_id                [DELETE]

└── /api/posts                                  [GET] [POST]
              /:post_id                         [GET] [DELETE]
              /like/:post_id                    [POST]
              /unlike/:post_id                  [POST]
              /comment/:post_id                 [POST]
              /comment/:post_id/:comment_id     [DELETE]
```

## Install dependencies

yarn add express body-parser cors sequelize sequelize-cli pg pg-hstore dotenv

yarn add nodemon -D

## Create your server main file

Let's create a usual express app:

```javascript
// server/index.js
const express = require('express')
const cors = require('cors')
const routes = require('../routes')
const bodyParser = require('body-parser')

const server = express()
server.use(express.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})
server.use(cors())
server.options('*', cors())

server.use('/api', routes)

module.exports = server
```

And add this to:

```javascript
require('dotenv').config()

const server = require('./server')

const PORT = process.env.PORT || 5000

server.listen(PORT, () => console.log(`Server is live at localhost:${PORT}`))
```

## Create your database

We will follow what we did on the last post, here is a summary:

- Create an .sequelizerc file and add the code from the post.
- Do **sequelize init** to generate the folders we need.
- Edit database/config/config.js to use enviroment variables.
- Create database using the CMD and add the connections strings to your .env file.
- Generate your models through sequelize with their attributes.
- Edit models/index.js to use your enviroment variables.
- If you have relationship between models add them using the sequelize helpers, associate and hasMany/belongsTo.
- **sequelize db:migrate** to generate your data.
- Optional you can add dummy data, use **sequelize seed:generate --name <model_name>** and edit the generated files with the information you want.

## Add our Endpoints

```javascript
const { Router } = require('express')
const controllers = require('../controllers')

const router = Router()

router.get('/', (req, res) => res.send('Welcome'))

// @route  GET /api/posts
// @desc   Get all posts available
// @access Public
router.get('/posts', controllers.getAllPosts)

// @route  GET /api/posts/:post_id
// @desc   Get post by id
// @access Public
router.get('/posts/:postId', controllers.getPostById)

// @route  POST /api/posts
// @desc   Create a post from a user
// @access Public
router.post('/posts', controllers.createPost)

// @route  PUT /api/posts/:post_id
// @desc   Update post using the id
// @access Public
router.put('/posts/:postId', controllers.updatePost)

// @route  DELETE /api/posts/:post_id
// @desc   Delete post by id
// @access Public
router.delete('/posts/:postId', controllers.deletePost)

module.exports = router
```

And we need to add our controllers:

```javascript
const models = require('../database/models')

const createPost = async (req, res) => {
  try {
    const post = await models.Post.create(req.body)
    return res.status(201).json({
      post,
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await models.Post.findAll({
      include: [
        {
          model: models.Comment,
          as: 'comments',
        },
        {
          model: models.User,
          as: 'author',
        },
      ],
    })
    return res.status(200).json({ posts })
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const getPostById = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await models.Post.findOne({
      where: { id: postId },
      include: [
        {
          model: models.Comment,
          as: 'comments',
          include: [
            {
              model: models.User,
              as: 'author',
            },
          ],
        },
        {
          model: models.User,
          as: 'author',
        },
      ],
    })
    if (post) {
      return res.status(200).json({ post })
    }
    return res.status(404).send('Post with the specified ID does not exists')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params
    const [updated] = await models.Post.update(req.body, {
      where: { id: postId },
    })
    if (updated) {
      const updatedPost = await models.Post.findOne({ where: { id: postId } })
      return res.status(200).json({ post: updatedPost })
    }
    throw new Error('Post not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params
    const deleted = await models.Post.destroy({
      where: { id: postId },
    })
    if (deleted) {
      return res.status(204).send('Post deleted')
    }
    throw new Error('Post not found')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
}
```

## Summary

- yarn add express body-parser cors sequelize sequelize-cli pg pg-hstore dotenv
- yarn add nodemon -D
- Create your express app adding cors and body-parser.
- Create your database following the instructions from the previous post.
- Create your routes and your endpoints.
- Create your controllers to specifiy exactly how you will handle each data.

## Conclusion

The hardest part was the setting up the database, but once you make it a step by step recipe it's much easier to deal with. So what comes next is then creating your routes, your express code and add your controllers specifying how the data will be handled.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
