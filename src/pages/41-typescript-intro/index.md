---
title: TypeScript: 
date: '2021-01-11T11:53:32.169Z'
---

> TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS. Syntax refers to the way we write text to form a program.

This is the definition from the documentation, but why should we learn TypeScript?

1. Less bugs, this happens because in Visual Studio Code it can instantly tell you when you messed up, lets say we send a number props to a component that actually needed a string prop, this creates an error if it wasn't properly validated, but with TypeScript it instantly tells you that you didnt send a string prop, this also saves you time.
2. Auto complete, you can use the command `ctrl + space` to check the props you have access to instead of going back and check.
3. Similar to Java and C, this makes it easier for developers of those languages to work with Javascript.
4. Its a basic requirement in 2021, like it or not this will be a very common requested skill in 2021 and almost every job is asking for it.

There are many more reasons but those are big ones for me.

## Setup

`create-react-app project-name --typescript`

This will generate a new project for you with everything setup so you don't need to mess with babel.

## Handling Props with Input

Lets take two files for example, first is App.tsx:

```typescript
import React from 'react'

const App: React.FC = () => {
  return <div>Whatsup</div>
}

export default App
```

You can generate this content using `rh` snippet.

Now the second file will be the TextField.tsx, but first lets check how a vanilla React would look:

```typescript
import React from 'react'

export const TextField = () => {
  return (
    <div>
      <input />
    </div>
  )
}
```

Lets take this step by step:

1. Add a type to the TextField const, in this case we want to say that it's a Functional Component from React.

```typescript
import React from 'react'

export const TextField: React.FC = () => {
  return (
    <div>
      <input />
    </div>
  )
}
```

2. Adding props in angular brackets, we can use an interface (it shapes props) and pass it.

```typescript
import React from 'react'

interface Person {
  firstName: string
  lastName: string
}

interface Props {
  text: string // required
  ok?: boolean // ? makes prop optional
  i?: number
  fn: (bob: string) => string
  person: Person
}

export const TextField: React.FC<Props> = () => {
  return (
    <div>
      <input />
    </div>
  )
}
```

We created an interface to shape the types of our props, and we can use another interface (Person) to give a shape to an object inside another interface (Props). We add the `?` to indicate that the prop is optional.

Now lets check our App.tsx and add this component:

```typescript
import React from 'react'
import { TextField } from './TextField'
// The above line gets added automatically when writing the component bellow

const App: React.FC = ({
  // You can use ctrl+space to access these
  text,
  person,
  fn,
}) => {
  return (
    <div>
      // If we press ctrl+space we can see the props
      <TextField text="hello" />
    </div>
  )
}

export default App
```

3. Lets check hooks!

```typescript
import React from 'react'

interface Person {
  firstName: string
  lastName: string
}

interface Props {
  text: string // required
  ok?: boolean // ? makes prop optional
  i?: number
  fn: (bob: string) => string
  person: Person
}

interface TextNode {
  text: string
}

export const TextField: React.FC<Props> = () => {
  const [count, setCount] = useState<number | null | undefined>({
    text: 'count',
  })

  /*
  You can create an interface
  useState<TextNode>
  */

  setCount(12)

  return (
    <div>
      <input />
    </div>
  )
}
```

4. Now lets check useRef

```typescript
interface Props {
  text: string // required
  ok?: boolean // ? makes prop optional
  i?: number
  fn: (bob: string) => string
  person: Person
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const TextField: React.FC<Props> = ({ handleChange }) => {
  const [count, setCount] = useState<number | null | undefined>({
    text: 'count',
  })
  const inputRef = useRef<HTMLInputElement>(null)
  const divRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={divRef}>
      <input ref={inputRef} onChange={handleChange} />
    </div>
  )
}
```

We need to tell TypeScript what the type for useRef is, so when you write a `ref={}` hover ref and it will tell you the possible types you need to add, which in this case its `HTMLInputElement`, and then you can add the `inputRef` to `ref`. **Hovering will be pretty common so get used to that**.

Same for handleChange, hover it and it will show you `(event: React.ChangeEvent<HTMLInputElement>) => void`. The great thing about this is that in App.tsx you have access to all the properties of the event now.

## UserReducer Hook

```typescript
import React, { useReducer } from 'react'

type Actions =
  | { type: 'add'; text: string } // We're enforcing the "add" on this choice
  | {
      type: 'remove'
      idx: number
    }

interface Todo {
  text: string
  complete: boolean
}

type State = Todo[] // Array of Todo Objects

const TodoReducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'add':
      return [...state, { text: action.text, complete: false }]
    case 'remove':
      return state.filter((_, i) => action.idx !== i)
    default:
      return state
  }
}

export const ReducerExample: React.FC = () => {
  const [todos, dispatch] = useReducer(TodoReducer, [])

  return (
    <div>
      {JSON.stringify(todos)}
      <button
        onClick={() => {
          dispatch({ type: 'add', text: '...' })
        }}
      >
        +
      </button>
    </div>
  )
}
```

Nothing groundbreaking, but we can enforce that the actions can be of two types, if its `add` it will have a `text`. If its `remove` it will have `idx`, it will give error otherwise. Now we can use it in:

```typescript
import React, { useState } from 'react'

interface Props {
  children: (
    data: {
      count: number
      setCount: React.Dispatch<React.SetStateAction<number>>
    }
  ) => JSX.Element | null
}

export const Counter: React.FC<Props> = ({ children }) => {
  const [count, setCount] = useState(0)

  return <div>{children({ count, setCount })}</div>
}
```

## Conclusion

TypeScript is interesting so far, it certainly helps to detect bugs and ensure a project is working as intended, especially when many developers are sending PRs for that same project. It will be also easier to test (will check that subject in another post).

For our next post we will work with applying this knowledge in a more interesting project and see how it turns out!

See you on the next post.

Sincerely,

**Eng Adrian Beria.**
