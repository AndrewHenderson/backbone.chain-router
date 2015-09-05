# backbone.nested-router

Extend Backbone's Router to allow for nested routes.

### What problem does this library solve?

Currently, Backbone's Router does not allow for a route to execute more than one callback. This library now let's us do just that.

Allowing for dot syntax to be used in callback names, you're now able to chain your callbacks, executing one after the other.

If a route returns an argument, the argument is passed to the route that follows.

If the route that follows is already being passed arguments, say based on the syntax of its corresponding route fragment, the preceding route's returned argument will be included at the end of the following route's arguments list.

If a route returns an array of arguments, these arguments will be unpacked and passed as additional paramters at the end of the following route's arguments list.

#### Example Usage

```js
Backbone.Router.extend({

  routes: {
    'posts': 'posts',
    'posts/new': 'posts.new',
    'post/:post_id': 'post',
    'post/:post_id/edit': 'post.edit',
    'post/:post_id/comments': 'post.comments',
    'post/:post_id/comments/:id': 'post.comments.comment'
  },

  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
  },

  new: function () {
    console.log('posts.new');
    console.log(arguments); // [null]
  },

  post: function (id) {
    console.log('post');
    console.log(arguments); // [id, null]
  },

  edit: function (id) {
    console.log('post.edit');
    console.log(arguments); // [null]
  },

  comments: function () {
    console.log('post.comments');
    console.log(arguments); // [null]
  },

  comment: function (id) {
    console.log('post.comments.comment');
    console.log(arguments); // [null, id]
  }
});
```
