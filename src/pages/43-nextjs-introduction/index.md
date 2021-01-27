---
title: Next JS - Introduction
date: '2021-01-26T11:53:32.169Z'
---

## What is Next JS

Is a React frontend development framework that enables functionality such as server-side rendering and static site generation.

## Server-Side Rendering

Unlike a traditional React app where the entire application is loaded and rendered on the client, Next allows the first page load to be rendered by the server, which is great for SEO & performance.

### Other Next.js benefits

- Easy page routing
- API routes
- Out of the box TypeScript & Sass
- Static Site Generation (next export)
- Easy deployment

## Getting Started

```
npx create-next-app app-name --use-yarn
cd app-name
code .
```

Folder structure is very simple:

- pages
  - api
  - \_app.js
  - index.js
- public
  - favicon.ico
  - vercel.svg
- styles
  - globals.css
  - Home.modules.css

You can also add a flag for styled components.

We can't import global CSS into a component, it needs to have the `Home.module.css` naming convention.

You should put global css in the file with the name.

### Styles

Inside the folder we can add `Layout.module.css` and inside `components/Layout.js` we can:

```javascript
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
```

Now inside our \_app.js file:

```javascript
import Layout from '../components/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### Routing

If you add an about.js page on the pages folder:

```javascript
const about = () => {
  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export default about
```

And you go to `localhost:3000/about` you will load the page!

### Head component

Its similar to `react-helmet`:

```javascript
import Head from 'next/head'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Web Dev</title>
        <meta name="keywords" content="web development, programming" />
      </Head>
    </div>
  )
}
```

Its more efficent to create a Head component and import it since each route will need the meta tags.

## Navigation component

Lets create a Nav.module.css:

```css
.nav {
  height: 50px;
  padding: 10px;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.nav ul {
  display: flex;
  justify-content: center;
  align-items: center;
  list-style: none;
}

.nav ul li a {
  margin: 5px 15px;
}
```

Inside components create Nav.js and instead of react-router Links, we can use the one that comes with next:

```javascript
import Link from 'next/link'
import navStyles from '../styles/Nav.module.css'

const Nav = () => {
  return (
    <nav className={navStyles.nav}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
      </ul>
    </nav>
  )
}
```

## Cleaning up

Lets cleanup Layout:

```javascript
import Nav from './Nav'
import Meta from './Meta'
import Header from './Header'
import styles from '../styles/Layout.module.css'

const Layout = ({ children }) => {
  return (
    <>
      <Meta />
      <Nav />
      <div className={styles.container}>
        <main className={styles.main}>
          <Header />
          {children}
        </main>
      </div>
    </>
  )
}
```

Where Header is:

```javascript
import headerStyles from '../styles/Header.module.css'

const Header = () => {
  return (
    <div>
      <h1 className={headerStyles.title}>
        <span>WebDev</span> News
      </h1>
      <p className={headerStyles.description}>
        Keep up to date with the latest web dev news
      </p>
    </div>
  )
}
```

Header styles:

```css
.title a,
.title span {
  color: #0070f3;
  text-decoration: none;
}

.title a:hover,
.title a:focus,
.title a:active {
  text-decoration: underline;
}

.title {
  margin: 0;
  line-height: 1.15;
  font-size: 4rem;
}

.title,
.description {
  text-align: center;
}

.description {
  line-height: 1.5;
  font-size: 1.5rem;
}
```

And Meta:

```javascript
import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <link rel="icon" href="/favicon.ico" />
      <title>{title}</title>
    </Head>
  )
}

Meta.defaultProps = {
  title: 'WebDev Newz',
  keywords: 'web development, programming',
  description: 'Get the latest news in web dev',
}
```

## Fetching Data

We can use `getStaticProps`

```javascript
export const getStaticProps = async () => {
  const res = await fetch(`${server}/api/articles`)
  const articles = await res.json()

  return {
    props: {
      articles,
    },
  }
}
```

If we apply this to `index.js`:

```javascript
import { server } from '../config'
import ArticleList from '../components/ArticleList'

export default function Home({ articles }) {
  return (
    <div>
      <ArticleList articles={articles} />
    </div>
  )
}

export const getStaticProps = async () => {
  const res = await fetch(`${server}/api/articles`)
  const articles = await res.json()

  return {
    props: {
      articles,
    },
  }
}
```

Notice that Home can read the props from the method!

ArticleList is:

```javascript
import ArticleItem from './ArticleItem'
import articleStyles from '../styles/Article.module.css'

const ArticleList = ({ articles }) => {
  return (
    <div className={articleStyles.grid}>
      {articles.map(article => (
        <ArticleItem article={article} />
      ))}
    </div>
  )
}
```

And ArticleItem:

```javascript
import Link from 'next/link'
import articleStyles from '../styles/Article.module.css'

const ArticleItem = ({ article }) => {
  return (
    <Link href="/article/[id]" as={`/article/${article.id}`}>
      <a className={articleStyles.card}>
        <h3>{article.title} &rarr;</h3>
        <p>{article.excerpt}</p>
      </a>
    </Link>
  )
}
```

## Nested Routes

Inside `pages/article` create `pages/article/[id]/index.js` where we will add:

```javascript
import { server } from '../../../config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Meta from '../../../components/Meta'

const article = ({ article }) => {
  return (
    <>
      <Meta title={article.title} description={article.excerpt} />
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <br />
      <Link href='/'>Go Back</Link>
    </>
  )
}

export const getStaticProps = async (context) => {
  const res = await fetch(`${server}/api/articles/${context.params.id}`)

  const article = await res.json()

  return {
    props: {
      article,
    },
  }
}

export const getStaticPaths = async () => {
  const res = await fetch(`${server}/api/articles`)

  const articles = await res.json()

  const ids = articles.map((article) => article.id)
  const paths = ids.map((id) => ({ params: { id: id.toString() } }))

  return {
    paths,
    fallback: false,
  }
}

export default
```

Using a combination of both `getStaticPaths` and `getStaticProps` we can perform async operations and it add it as props for the component.

## Generate a static website

Add on package JSON `"build": "next build && next export"`, then build your app and you will get an `out` folder. Next you add `serve` package globally `npm i -g serve`, followed by the command `serve -s -out -p 8000`, we're telling it to show the static site in the port 8000 and there you go!

## API Routes

In `pages/api/articles/index.js` add:

```javascript
import { articles } from '../../../data'

export default function handler(req, res) {
  res.status(200).json(articles)
}
```

Now on the same root add [id].js

```javascript
import { articles } from '../../../data'

export default function handler({ query: { id } }, res) {
  const filtered = articles.filter(article => article.id === id)

  if (filtered.length > 0) {
    res.status(200).json(filtered[0])
  } else {
    res
      .status(404)
      .json({ message: `Article with the id of ${id} is not found` })
  }
}
```

This way we can work the usual responses we would get from a real backend!

Next create on the root folder `config/index.js`

```javascript
const dev = process.env.NODE_ENV !== 'production'

export const server = dev ? 'http://localhost:3000' : 'https://yourwebsite.com'
```

## Conclusion

NextJS is a very powerful framework that has less weight, comes with routing, server side rendering which helps SEO and can export static sites! We have been checking important subjects lately, for the next post we will make a project using TypeScript, Next JS, Framer, Chakra UI and test it with react-testing-library!
