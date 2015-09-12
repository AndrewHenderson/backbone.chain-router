define(function(require){

  var Backbone = require('backbone');
  var ChainRouter = require('dist/backbone.chain-router');

  describe('Chain Router', function(){

    describe('when routing to a matched route with chaining', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'post/:id': 'posts.post'
          },
          posts: sinon.spy(),
          post: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
      });

      it('should call both routes in order', function(){
        this.router.navigate('post/15',{trigger: true});
        expect(this.router.posts).to.have.been.calledOnce;
        expect(this.router.post).to.have.been.calledOnce;
      });

      afterEach(function(){
        location.hash = '';
      });

      after(function(){
        Backbone.history.stop();
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