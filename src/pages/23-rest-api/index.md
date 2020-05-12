---
title: REST API
date: "2020-05-04T11:53:32.169Z"
---

REST determines how the API looks like. It stands for “Representational State Transfer”. It is a set of rules that developers follow when they create their API. One of these rules states that you should be able to get a piece of data (called a resource) when you link to a specific URL.

An API is an application programming interface. It is a set of rules that allow programs to talk to each other. The developer creates the API on the server and allows the client to talk to it.

## The Anatomy Of A Request

It’s important to know that a request is made up of four things:

- The endpoint
- The method
- The headers
- The data (or body)

## Endpoints

The **endpoint** (or route) is the url you request for. It follows this structure:

    root-endpoint/?

The root-endpoint is the starting point of the API you’re requesting from. The root-endpoint of Github’s API is https://api.github.com.

The path determines the resource you’re requesting for.

Lets take the following URL as an example:

- https://www.smashingmagazine.com/tag/javascript/. 
- https://www.smashingmagazine.com/ is **the root-endpoint** and 
- /tag/javascript is the **path**.

Let’s say you want to get a list of repositories by a certain user through Github’s API. The docs tells you to use the the following path to do so:

    /users/:username/repos

Any colons (:) on a path denotes a variable. You should replace these values with actual values of when you send your request. In this case, you should replace **:username** with the actual username of the user you’re searching for. If I’m searching for my Github account, I’ll replace **:username with radinax**.

The endpoint to get a list of my repos on Github is this:

    https://api.github.com/users/radinax/repos

The final part of an endpoint is query parameters. **Query** parameters give you the option to modify your request with **key-value pairs**. They always begin with a **question mark (?)**. Each parameter pair is then separated with an **ampersand (&)**, like this:

    ?query1=value1&query2=value2

If you’d like to get a list the repositories that I pushed to recently, you can set sort to push, according to the documnentation.

https://api.github.com/users/radinax/repos?sort=pushed

## METHOD

The method is the type of request you send to the server. You can choose from these five types below:

- GET: Get data from server.
- POST: Post data to server.
- PUT: Updates data in the server.
- DELETE: Deletes data in the server.

## HEADERS

Headers are used to provide information to both the client and server. It can be used for many purposes, such as authentication and providing information about the body content. You can find a list of valid headers on MDN’s [HTTP Headers Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers).

HTTP Headers are property-value pairs that are separated by a colon.

    "Content-Type: application/json"

## DATA or BODY

Contains information you want to be sent to the server. This option is only used with POST, PUT or DELETE requests.

## AUTHENTICATION

Developers put measures in place to ensure you perform actions only when you’re authorized to do. This prevents others from impersonating you.

On the web, there are two main ways to authenticate yourself:

- With a username and password (also called basic authentication)
- With a secret token

The secret token method includes [oAuth](https://oauth.net/), which lets you to authenticate yourself with social media networks like Github, Google, Twitter, Facebook, etc.

## HTTP Status Codes and Error Messages

In general, the numbers follow the following rules:

- 200+ means the request has succeeded.
- 300+ means the request is redirected to another URL
- 400+ means an error that originates from the client has occurred
- 500+ means an error that originates from the server has occurred

For more references check the MDN's [HTTP Status Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

## API Versions

Developers update their APIs from time to time. Sometimes, the API can change so much that the developer decides to upgrade their API to another version. If this happens, and your application breaks, it’s usually because you’ve written code for an older API, but your request points to the newer API.

You can request for a specific API version in two ways. Which way you choose depends on how the API is written.

These two ways are:

- Directly in the endpoint
- In a request header

Twitter, for example, uses the first method. At the time of writing, Twitter’s API is at version 1.1, which is evident through its endpoint:

    https://api.twitter.com/1.1/account/settings.json

Github, on the other hand, uses the second method. At the time of writing, Github’s API is at version 3, and you can specify the version with an Accept header:

    curl https://api.github.com -H Accept:application/vnd.github.v3+json

## Testing Endpoints with cURL

For using this tool go to [their website](https://curl.haxx.se/download.html) and install it.

To use cURL go to your terminal:

    curl https://api.github.com

It will give you instruction on how to perform certain actions. To get a list of your repositories:

    curl https://api.github.com/users/radinax/repos

If you try a POST request:

    curl -X POST https://api.github.com/radinax/repos

It will say you need to authenticate. For sending headers:

    curl -H "Content-Type: application/json" https://api.github.com

To view headers:

    curl -H "Content-Type: application/json" https://api.github.com -v

To send data:

    curl -X POST <URL> -d property1=value1

To send multiple data fields:

    curl -X POST <URL> \
      -d property1=value1 \
      -d property2=value2

A normal request using requestb as temporal server would look like:

    curl -X POST https://requestb.in/1ix963n1 \
      -H "Content-Type: application/json" \
      -d '{
      "property1":"value1",
      "property2":"value2"
    }'

To authenticate:

    curl -x POST -u "username:password" https://api.github.com/user/repos

## Conclusion

The objective of this post is to learn more about REST APIs which is a set of rules to read and send data through an API, it's similar to what we did with graphQL in previous posts and it's the most common way to work in the development industry. In the following posts we will learn more about how to build servers.

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
