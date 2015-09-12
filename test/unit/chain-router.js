define(function(require){

  var Backbone = require('backbone');
  var ChainRouter = require('dist/backbone.chain-router');

  describe('Router,', function(){

    describe('when executing a chained route,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/new': 'posts.new'
          },
          posts: sinon.spy(),
          new: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
      });

      it('should call both routes', function(){
        this.router.navigate('posts/new',{trigger: true});
        expect(this.router.posts).to.have.been.calledOnce;
        expect(this.router.new).to.have.been.calledOnce;
      });

      afterEach(function(){
        this.router.navigate('',{trigger: true});
      });

      after(function(){
        Backbone.history.stop();
      });
    });
  });
});