---
title: How to use Sequelize and PostgreSQL with a Node client
date: '2020-06-02T11:53:32.169Z'
---

We've alredy checked out MongoDB, now it's time for one of the most popular database out there which is PostgreSQL, which is a free and open source relational database management system.

> PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance.

We will also use Sequelize which is:

> a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. It features solid transaction support, relations, eager and lazy loading, read replication and more.

It puts a ORM between Express and PostgreSQL to perform actions like writing SQL queries in the language of the server, it simplifies the process and it's the reason it's so popular to use.

To put it in another perspective, instead of writing:

```
SELECT * FROM users WHERE email = 'test@test.com';
```

We can do:

```
var orm = require('generic-orm-libarry');
var user = orm("users").where({ email: 'test@test.com' });
```

Notice how similar it's to Mongoose.

## Libraries needed

On the server besides the common ones for Express, we will also need the following:

- **sequelize** is self explanatory.
- **sequelize-cli** is a package that enables us interact with the database through sequelize from the CLI.
- **pg** short for postgres is a Postgres client for Node.js.
- **pg-hstore** is a node package for serializing and deserializing JSON data to hstore format.

## Installing PostgreSQL and adding it to the command line

Go to their [website](https://www.postgresql.org) and download the version you want, then just install and REMEMBER YOUR PASSWORD, for the username it's usually "postgres".

For adding it to the command line:

1. Go inside your installation folder into the .bin folder and copy that address, go to control panel -> system -> advanced -> env variables -> system variables, select Path and edit -> new -> copy your URL.
2. Do the same process but now go inside the lib folder and copy that URL instead.
3. On your CMD do psql -U <database_name> <username>, insert your password and now you're connected to the command line! This will be useful for what we're going to do next.

## Setting up Sequelize

**First** create a .sequelizerc file inside the root and the following:

```javascript
const path = require('path')

module.exports = {
  config: path.resolve('./database/config', 'config.js'),
  'models-path': path.resolve('./database/models'),
  'seeders-path': path.resolve('./database/seeders'),
  'migrations-path': path.resolve('./database/migrations'),
}
```

**Second** on your terminal do **sequelize init**. This will create following folders

- **config**, contains config file, which tells CLI how to connect with database
- **models**, contains all models for your project
- **migrations**, contains all migration files which transfer your existing database into another state and vice versa
- **seeders**, contains all seed files, these are some change in data that can be used to populate database table

**Third** edit your database/config/config.js file with:

```javascript
require('dotenv').config()

module.exports = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
}
```

## Create your database

In your CMD where you're logged in inside your postgres account, perform the following commands:

- **create database dev_db;**
- **create database test_db;**

With this your connection strings are:

- postgres://<db_user>:<db_password>@127.0.0.1:5432/dev_db
- postgres://<db_user>:<db_password>@127.0.0.1:5432/test_db

Now create an .env file and add these connection strings:

```javascript
DATABASE_URL=
DEV_DATABASE_URL=postgres://<db_user>:<db_password>@127.0.0.1:5432/dev_db
TEST_DATABASE_URL=postgres://<db_user>:<db_password>@127.0.0.1:5432/test_db
```

## Creating Models and Migrations

This will be the one we're gonna use in the project in the next post, which consist of a user who can post and comment, so let's use sequelize:

- **sequelize model:generate --name User --attributes name:string,email:string**

- **sequelize model:generate --name Post --attributes title:string,content:text,userId:integer**

- **sequelize model:generate --name Comment --attributes postId:integer,comment:text,userId:integer**

We're telling sequelize to generate a model with a specific name and the attributes are the Schema basically.

Now inside the migrations edit the following models:

```javascript
userId: {
  type: Sequelize.INTEGER,
  allowNull: false,
},

postId: {
  type: Sequelize.INTEGER,
  allowNull: false,
},
```

Next we have to change the models/index.js file to make it use the enviroment variables we setup:

```javascript
const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const envConfigs = require('../config/config')

const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = envConfigs[env]
const db = {}

let sequelize
if (config.url) {
  sequelize = new Sequelize(config.url, config)
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

//models/index.js
```

## Define the models relationships

Postgres is a relational database, so we need to specify the relationships between our three models generated (posts, comments, user):

- a **user has many posts** and a **post belongs to a user** (1:n)
- a **user has many comments** and a **comment belongs to a user** (1:n)
- a **post has many comments** and a **comment belongs to a post** (1:n)

Now let's translate this into code editing each database/models file as the follow:

- For the User we define once again the model and make the associations, we first say a **User has many Posts** and a **User has many comments**

```javascript
// database/models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {}
  )
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
      onDelete: 'CASCADE',
    })

    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
      onDelete: 'CASCADE',
    })
  }
  return User
}
```

- For the Post we define the model again and say a **Post has many Comments** and a **Post belongs to a User**

```javascript
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    },
    {}
  )
  Post.associate = function(models) {
    // associations can be defined here
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments',
      onDelete: 'CASCADE',
    })

    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    })
  }
  return Post
}

// database/models/post.js
```

- For the comments, we define the model and say a **Comment belongs to a User** and a **Comment belongs to a Post**.

```javascript
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      postId: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
    },
    {}
  )
  Comment.associate = function(models) {
    // associations can be defined here
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
    })
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      as: 'post',
    })
  }
  return Comment
}

// database/models/comment.js
```

With this done let's run **sequelize db:migrate**

## Seeding data to the database

Seeding is basically generating some dummy data and push it to the database:

sequelize seed:generate --name User

sequelize seed:generate --name Post

sequelize seed:generate --name Comment

Those commands will generate three files xxxx-User.js, xxxx-Post.js, and xxxx-Comment.js for User, Post and Comment models respectively. Now edit them as follow:

```javascript
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Jane Doe',
          email: 'janedoe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Jon Doe',
          email: 'jondoe@example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
}

// database/seeds/xxxx-User.js
```

```javascript
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Posts',
      [
        {
          userId: 1,
          title: 'hispotan de nu',
          content:
            'Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          title: 'some dummy title',
          content:
            'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Posts', null, {}),
}
// database/seeds/xxxx-Post.js
```

```javascript
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Comments',
      [
        {
          userId: 1,
          postId: 2,
          comment:
            'Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          postId: 1,
          comment:
            'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Comments', null, {}),
}

// database/seeds/xxxx-Comment.js
```

Now let's seed it using **sequelize db:seed:all**, and now we have added dummy data for a Client to consume!

## Summary

- yarn add sequelize dotenv sequelize-cli pg pg-hstore
- Install PostgreSQL from their website.
- Add it to the command line.
- Create an .sequelizerc file and add the code we put.
- Do **sequelize init** to generate the folders we need.
- Edit database/config/config.js to use enviroment variables.
- Create database using the CMD and add the connections strings to your .env file.
- Generate your models through sequelize with their attributes.
- Edit models/index.js to use your enviroment variables.
- If you have relationship between models add them using the sequelize helpers, associate and hasMany/belongsTo.
- **sequelize db:migrate** to generate your data.
- Optional you can add dummy data, use **sequelize seed:generate --name <model_name>** and edit the generated files with the information you want.

## Conclusion

Using PostgreSQL is indeed more complicated than MongoDB, has more steps to setup for a new project, so why use it? Why spend 20 minutes setting up with Sequelize when you could easily do it in less than 10 minutes with Mongoose and MongoDB?

**NoSQL databases** are good for document storage. Data that doesn't relate to anything else. **Relational databases are for** - you guessed it, relational data. Turns out, data in most applications are relational. A user has orders. Orders have items. Items have options, on and on. Relational databases have been around for decades for good reason. They're highly optimized for querying that data efficiently.

Usually most modern applications will have relations between each other, a user can have orders, which can have items, which can have companies, and so on, imagine doing this with MongoDB and the JSON it would generate? So as a norm you should be using MongoDB when you don't have any relational data, for every other case PostgreSQL is the go to.

Something to note is that we can use MongoDB for some relations, in our previous project we had a User that could create a Post and Comment others as well, they were related, so it's not like you have to use PostgreSQL for simple relational data, but keep in mind how your app will scale and the size of it.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
