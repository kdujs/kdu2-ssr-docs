# Getting Started

## Installation

``` bash
npm install kdu kdu-server-renderer --save
```

We will be using NPM throughout the guide, but feel free to use [Yarn](https://yarnpkg.com/en/) instead.

#### Notes

- It's recommended to use Node.js version 10+.
- `kdu-server-renderer` and `kdu` must have matching versions.
- `kdu-server-renderer` relies on some Node.js native modules and therefore can only be used in Node.js. We may provide a simpler build that can be run in other JavaScript runtimes in the future.

## Rendering a Kdu Instance

``` js
// Step 1: Create a Kdu instance
const Kdu = require('kdu')
const app = new Kdu({
  template: `<div>Hello World</div>`
})

// Step 2: Create a renderer
const renderer = require('kdu-server-renderer').createRenderer()

// Step 3: Render the Kdu instance to HTML
renderer.renderToString(app, (err, html) => {
  if (err) throw err
  console.log(html)
  // => <div data-server-rendered="true">Hello World</div>
})

// in 2.5.0+, returns a Promise if no callback is passed:
renderer.renderToString(app).then(html => {
  console.log(html)
}).catch(err => {
  console.error(err)
})
```

## Integrating with a Server

It is pretty straightforward when used inside a Node.js server, for example [Express](https://expressjs.com/):

``` bash
npm install express --save
```
---
``` js
const Kdu = require('kdu')
const server = require('express')()
const renderer = require('kdu-server-renderer').createRenderer()

server.get('*', (req, res) => {
  const app = new Kdu({
    data: {
      url: req.url
    },
    template: `<div>The visited URL is: {{ url }}</div>`
  })

  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }
    res.end(`
      <!DOCTYPE html>
      <html lang="en">
        <head><title>Hello</title></head>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

## Using a Page Template

When you render a Kdu app, the renderer only generates the markup of the app. In the example we had to wrap the output with an extra HTML page shell.

To simplify this, you can directly provide a page template when creating the renderer. Most of the time we will put the page template in its own file, e.g. `index.template.html`:

``` html
<!DOCTYPE html>
<html lang="en">
  <head><title>Hello</title></head>
  <body>
    <!--kdu-ssr-outlet-->
  </body>
</html>
```

Notice the `<!--kdu-ssr-outlet-->` comment -- this is where your app's markup will be injected.

We can then read and pass the file to the Kdu renderer:

``` js
const renderer = require('kdu-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

renderer.renderToString(app, (err, html) => {
  console.log(html) // will be the full page with app content injected.
})
```

### Template Interpolation

The template also supports simple interpolation. Given the following template:

``` html
<html>
  <head>
    <!-- use double mustache for HTML-escaped interpolation -->
    <title>{{ title }}</title>

    <!-- use triple mustache for non-HTML-escaped interpolation -->
    {{{ meta }}}
  </head>
  <body>
    <!--kdu-ssr-outlet-->
  </body>
</html>
```

We can provide interpolation data by passing a "render context object" as the second argument to `renderToString`:

``` js
const context = {
  title: 'hello',
  meta: `
    <meta ...>
    <meta ...>
  `
}

renderer.renderToString(app, context, (err, html) => {
  // page title will be "Hello"
  // with meta tags injected
})
```

The `context` object can also be shared with the Kdu app instance, allowing components to dynamically register data for template interpolation.

In addition, the template supports some advanced features such as:

- Auto injection of critical CSS when using `*.kdu` components;
- Auto injection of asset links and resource hints when using `clientManifest`;
- Auto injection and XSS prevention when embedding Kdux state for client-side hydration.

We will discuss these when we introduce the associated concepts later in the guide.

## full demo codes

```js

const Kdu = require('kdu');
const server = require('express')();

const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('kdu-server-renderer').createRenderer({
  template,
});

const context = {
    title: 'kdu ssr',
    meta: `
        <meta name="keyword" content="kdu,ssr">
        <meta name="description" content="kdu srr demo">
    `,
};

server.get('*', (req, res) => {
  const app = new Kdu({
    data: {
      url: req.url
    },
    template: `<div>The visited URL is: {{ url }}</div>`,
  });

  renderer
  .renderToString(app, context, (err, html) => {
    console.log(html);
    if (err) {
      res.status(500).end('Internal Server Error')
      return;
    }
    res.end(html);
  });
})

server.listen(8080);

```
