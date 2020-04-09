---
title: Our First Component
date: "2018-12-04T11:50:37.121Z"
---

Building a React app is all about components. An individual React component can be thought of as a UI component in an app.

Not only do React components map cleanly to UI components, but they are self-contained. The markup, view logic, and often component-specific style is all housed in one place. This feature makes React components **reusable**.

## Lets make a Component!

Lets get right into action, first lets make a project folder named "React Tutorial - My First Component", inside make a html file with the following information:

    <!doctype html>  
    <html>  
	    <head>  
		    <meta charset="utf-8">  
		    <title>My First Component!</title>  
		    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>  
		    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>  
		    <script src="https://unpkg.com/babel-standalone@6.26.0/babel.js"></script>  
		</head>  
		<body>  
			<div id="root"></div>  
			<script type="text/babel"> 
				// React code will go here 
			</script>  
		</body>  
	</html>
These are the latest packages used at the moment of writing this post, so please double check if you need to use a more recent version.

Now lets check what are we loading:
- [React](https://reactjs.org/docs/react-api.html): You're getting the React **Top-Level API** which is the main entry point to the library.
- [React DOM](https://reactjs.org/docs/react-dom.html): This is where we can access the Top-Level APIs, most notably "render()".
- [Babel](https://babeljs.io/): It's a Javascript transpiler that let us turn our ES6+ into older ES5 because some browsers don't support it yet.

In your React code put the following:

    class HelloMessage extends React.Component {
	  render() {
	    return (
	      <div>
	        Hello {this.props.name}
	      </div>
	    );
	  }
	}

	ReactDOM.render(
	  <HelloMessage name="Adrian" />,
	  mountNode
	);

We're using classes where **"HelloMessage"** is the name of our first component and then we [**extend**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) our Parent Class which is **"React.Component"**. We're basically making **HelloMessage** a React Component.

Notice we're using a capital letter to define our Component, and this is because if we used lowercase JSX reads it as HTML tag and not as a React Component. This is how React knows to render a Component, and not a HTML Element.

There are two ways we can define a component, functional or classes. We generally use functional components when we don't have a state and we won't use Life Cycle Hooks methods which are available to classes.

We use **render** (refers to a technique for sharing code between React components using a prop whose value is a function) to return a JSX which is "React Code".

JSX can be seen as HTML inside Javascript.

Now what is this weird "**this.props.name**" in curly braces? With curly braces we can write Javascript inside our HTML, we will go more in depth with this feature in other posts working with arrays and objects.

**this.props**, the "this"will be bound to the React Component Class so we're accessing the "**prop**erties" of the Component.

We use **props** to send data to components, in this case ours is named **HelloMessage** and we're sending the data called "Adrian".

So we render our HelloMessage component:

	ReactDOM.render( 
		<HelloMessage name="Adrian" />,
	    document.getElementById('root') 
	);

Which will give us the same output (Hello) but with different names. 

## Conclusion

We learned the basics of what's going on in a React code, what means extending a parent component to its child, then rendering the component with the ReactDOM "render method" to render our component into the "root" id we created in our HTML file.

This is barely the start, we will go much more in depth in the next post with **state**.

See you on the next post.

Sincerely,

**Eng. Adrian Beria.**