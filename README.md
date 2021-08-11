# Hacker News Realtime Listener

[![NPM version](https://img.shields.io/npm/v/hackernews-realtime-listener)](https://npmjs.com/package/hackernews-realtime-listener) ![Minizipped bundle size](https://img.shields.io/bundlephobia/minzip/hackernews-realtime-listener)

This JavaScript package allows you to listen to Hacker News stories and comments in real time. It uses [the Hacker News API](https://github.com/HackerNews/API#readme).

## Usage

This package exports a default function called `listen()` that accepts a required callback function as its argument.

Example:
```javascript

const { default: listen } = require("hackernews-realtime-listener")

const listener = listen(item => {
    // Do something with the item here.
    // For the item schema, see https://github.com/HackerNews/API#items

    console.log(item)
})

```

With advanced options:
```javascript
const { default: listen } = require("hackernews-realtime-listener")

const listener = listen(item => {
    // ...
})
```

Note: When ``listen()`` or ``start()`` is called, it immediately triggers the callback with the latest item.

To stop listening, just call ``listener.stop()``, and to start listening again, call ``listener.start()`` (the listener is the return value of the listen() function).

Pretty simple, isn't it?

## Lower level API

This package also provides a lower level object-based API.

Example:

```javascript
const { RealtimeListener } = require("hackernews-realtime-listener")

const listener = new RealtimeListener(() => {
    // The callback...
}).start() // You can also call start() later on the RealtimeListener object, just like listen().
```

## Usage in the browser

To use this package in the browser, you can use [the Skypack CDN](https://www.skypack.dev/):
```html
<script type="module">
    import listen from "https://cdn.skypack.dev/hackernews-realtime-listener"

    // ...
</script>
```

Right now, we don't have a minified JS bundle. Maybe in the future.
