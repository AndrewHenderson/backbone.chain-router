# backbone.nested-router

Extend Backbone's Router to allow for nested routes.

### What problem does this library solve?

Currently, Backbone's Router does not allow for a route to execute more than one callback.

This library now let's us do that.

#### Example Usage

Using dot syntax within callback names, we're now able to chain our callbacks, executing one after the other.

```js
Backbone.Router.extend({
  routes: {
    'posts': 'posts',
    'posts/new': 'posts.new'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
  },
  new: function () {
    console.log('posts.new');
    console.log(arguments); // [null]
  }
});
```
If a route returns an argument, the argument will be passed to the route that follows it in the chain.
```js
Backbone.Router.extend({
  routes: {
    'posts': 'posts',
    'posts/new': 'posts.new'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
    return "somestring";
  },
  new: function () {
    console.log('posts.new');
    console.log(arguments); // ["somestring", null]
  }
});
```
If a route returns an array of arguments, these arguments will be unpacked and passed as additional paramters at the end of the next route's arguments list.
```js
Backbone.Router.extend({
  routes: {
    'posts': 'posts',
    'posts/new': 'posts.new'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
    return ["somestring", {foo: "bar"}, true];
  },
  new: function () {
    console.log('posts.new');
    console.log(arguments); // ["somestring", {foo: "bar"}, true, null]
  }
});
```
If the route that follows is already being passed arguments, say based on the syntax of its corresponding route fragment, the preceding route's returned argument will be included at the end of the following route's arguments list.
```js
Backbone.Router.extend({
  routes: {
    'posts': 'posts',
    'posts/:id': 'posts.post'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
    return ["somestring", {foo: "bar"}, true];
  },
  post: function (id) {
    console.log('posts.new');
    console.log(arguments); // [id, "somestring", {foo: "bar"}, true, null]
  }
});
```
Routes parameters only pass paramters to the corresponding route callback. Following callbacks will not be passed parameters designated to preceding routes.
```js
Backbone.Router.extend({
  routes: {
    'post/:post_id': 'post',
    'post/:post_id/edit': 'post.edit',
  },
  post: function (id) {
    console.log('post');
    console.log(arguments); // [id, null]
  },
  edit: function (id) {
    console.log('post.edit');
    console.log(arguments); // [null]
  }
});
```
Chained routes with parameters will each be passed their respective parameter only.
```js
Backbone.Router.extend({
  routes: {
    'post/:post_id/comment/:id': 'post.comment'
  },
  post: function (postId) {
    console.log('post.comments');
    console.log(arguments); // [postId, null]
  },
  comment: function (commentId) {
    console.log('post.comments.comment');
    console.log(arguments); // [commentId, null]
  }
});
```
Sometimes, you may want to call routes in the middle of the chain which are not meant to intercept the parameters in the route fragments. In this case, you must bracket the callback.
```js
Backbone.Router.extend({
  routes: {
    'post/:post_id/comments/:id': 'post.[comments].comment'
  },
  post: function (postId) {
    console.log('post.comments');
    console.log(arguments); // [postId, null]
  },
  comments: function () {
    console.log('post.comments');
    console.log(arguments); // [null]
  },
  comment: function (commentId) {
    console.log('post.comments.comment');
    console.log(arguments); // [id, null]
  }
});
```
