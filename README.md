# backbone.nested-router

Extend Backbone's Router to allow for nested routes.

### What problems does this library solve?

Currently, Backbone's Router does not allow for a route to execute more than one callback. This library let's you do just that.

Allowing for dot syntax to be used in callback names, you're now able to chain your callbacks, executing one after the other.

If a route returns an argument, the argument is passed to the route that follows.

If this route is already being passed arguments based on the syntax of the route fragment, the returned argument will be included at the end of the next route's arguments list.

If your route returns an array of arguments, these arguments will be unpacked and passed as additional paramters at the end of the next route's arguments list.

#### Example Usage

```js
Backbone.Router.extend({

  routes: {
    'posts': 'posts',
    'posts/new': 'posts.new',
    'post/:post_id': 'post',
    'post/:post_id/edit': 'post.edit',
    'post/:post_id/comments': 'comments',
    'post/:post_id/comments/new': 'post.comments.newcomment'
    // Using "newcomment" since "new" was already registered as a "posts" callback
  },

  posts: function () {
    console.log('posts');
    console.log(arguments); // [null]
  },

  new: function () {
    console.log('post.new');
    console.log(arguments); // [null]
  },

  post: function (id) {
    console.log('post');
    console.log(arguments); // [id, null]
  },

  edit: function () {
    console.log('post.edit');
    console.log(arguments);
  },

  comments: function () {
    console.log('comments');
    console.log(arguments);
  },

  newcomment: function () {
    console.log('post.comments.newcomment');
    console.log(arguments);
  }
});
```
