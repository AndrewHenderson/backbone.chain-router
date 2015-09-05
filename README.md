# backbone.nested-router

Extend Backbone's Router to allow for nested routes.

### What problem does this library solve?

Currently, Backbone's Router does not allow for a route to execute more than one callback.

This library now let's it do that.

#### Example Usage

Using dot syntax within callback names, we're now able to chain our callbacks, executing one after the other.

```js
Backbone.Router.extend({
  routes: {
    'posts/new': 'posts.new'
  },
  posts: function () {
    console.log('posts'); // called first
  },
  new: function () {
    console.log('posts.new'); // called second
  }
});
```
If a route returns an argument, the argument will be passed to the route that follows it in the chain.
```js
Backbone.Router.extend({
  routes: {
    'posts/new': 'posts.new'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
    return 'somestring';
  },
  new: function () {
    console.log('posts.new');
    console.log(arguments); // ['somestring', null]
  }
});
```
If a route returns an array of arguments, these arguments will be unpacked and placed at the end of the next route's arguments list.
```js
Backbone.Router.extend({
  routes: {
    'posts/new': 'posts.new'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
    return ['somestring', {foo: 'bar'}, true];
  },
  new: function () {
    console.log('posts.new');
    console.log(arguments); // ['somestring', {foo: 'bar'}, true, null]
  }
});
```
If the route that follows is already being passed arguments, say based on the syntax of its corresponding route fragment, the preceding route's returned argument will be placed at the end of the following route's existing arguments list.
```js
Backbone.Router.extend({
  routes: {
    'posts/:post_id': 'posts.post'
  },
  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
    return ['somestring', {foo: 'bar'}, true];
  },
  post: function (post_id) {
    console.log('posts.post');
    console.log(arguments); // [post_id, 'somestring', {foo: 'bar'}, true, null]
  }
});
```
Chained routes with fragment parameters are passed their parameters respectively.
```js
Backbone.Router.extend({
  routes: {
    'post/:post_id/comment/:comment_id': 'post.comment'
  },
  post: function (post_id) {
    console.log('post');
    console.log(arguments); // [post_id, null]
  },
  comment: function (comment_id) {
    console.log('post.comment');
    console.log(arguments); // [comment_id, null]
  }
});
```
Sometimes, we may want to include an additional route in the chain which is not intended to be passed route fragment parameters.

In this case, we bracket that callback.
```js
Backbone.Router.extend({
  routes: {
    'post/:post_id/comments/:comment_id': 'post.[comments].comment'
  },
  post: function (post_id) {
    console.log('post.comments');
    console.log(arguments); // [post_id, null]
  },
  comments: function () {
    console.log('post.comments');
    console.log(arguments); // [null]
  },
  comment: function (comment_id) {
    console.log('post.comments.comment');
    console.log(arguments); // [comment_id, null]
  }
});
```
Because callback chains reference unique methods on the router, two chains containing the same string will execute the same callback.
```js
Backbone.Router.extend({
  routes: {
    'posts/new': 'posts.new',
    'comments/new': 'comments.new'
  },
  posts: function () {
    console.log('posts');
  },
  comments: function () {
    console.log('comments');
  },
  new: function () {
    console.log('posts.new');
    console.log('comments.new');
  }
});
```
We can avoid this simply by being more descriptive when naming our callbacks.
```js
Backbone.Router.extend({
  routes: {
    'posts/new': 'posts.newPost',
    'comments/new': 'comments.newComment'
  },
  posts: function () {
    console.log('posts');
  },
  newPost: function () {
    console.log('posts.newPost');
  }
  comments: function () {
    console.log('comments');
  },
  newComment: function () {
    console.log('comments.newComment');
  }
});
```
