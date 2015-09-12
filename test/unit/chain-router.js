define(function(require) {

  var _ = require('underscore');
  var Backbone = require('backbone');
  require('chainRouter');

  describe('Chain Router', function () {
    beforeEach(function () {
      var Router = Backbone.Router.extend({
        routes: {
          'post/:id': '[posts].post'
        },
        posts: function () {
          console.log(arguments); // [post_id, null]
        },
        post: function (post_id) {
          console.log(arguments); // [post_id, 'somestring', {foo: 'bar'}, true, null]
        }
      });
      this.router = new Router();
      Backbone.history.start();
      sinon.spy(this.router, 'posts');
      sinon.spy(this.router, 'post');
    });

    describe('when routing to a matched route with nesting', function () {

      it('should call post with the correct arguments', function() {
        var self = this;
        location.hash = 'post/15';
        _.delay(function(){
          expect(self.router.posts).to.have.been.calledOnce;
          expect(self.router.post).to.have.been.calledOnce;
        }, 1000);
      });

      //beforeEach(function() {
      //  this.router.navigate('posts/15');
      //});
      //
      //it('should trigger onNavigate', function () {
      //  expect(this.router.composeNestedRoute).to.be.a('function');
      //});
    });
  });
});