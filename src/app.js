define(function(require){

  var Backbone = require('backbone');

  var Router = Backbone.Router.extend({
    routes: {
      'posts/:post_id': '[posts].post'
    },
    posts: function () {
      console.log(arguments); // [post_id, null]
      return ['somestring', {foo: 'bar'}, true];
    },
    post: function (post_id) {
      console.log(arguments); // [post_id, 'somestring', {foo: 'bar'}, true, null]
    }
  });
  var router = new Router();
  Backbone.history.start({pushState: true});
});