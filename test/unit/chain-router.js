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
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should call both routes.', function(){
        expect(this.router.posts).to.have.been.calledOnce;
        expect(this.router.new).to.have.been.calledOnce;
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained route with a returned argument,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/new': 'posts.new'
          },
          posts: function(){
            return 'somestring';
          },
          new: sinon.spy()
        });
        this.router = new Router();
        sinon.spy(this.router, 'posts');
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should pass the argument to the second route.', function(){
        assert(this.router.new.calledWith('somestring'));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained route with return arguments,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/new': 'posts.new'
          },
          posts: function(){
            return ['somestring', {foo: 'bar'}, true];
          },
          new: sinon.spy()
        });
        this.router = new Router();
        sinon.spy(this.router, 'posts');
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should pass all arguments to the second route.', function(){
        assert(this.router.new.calledWith('somestring', {foo: 'bar'}, true));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained & bracketed route that returns arguments,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/new': '[posts].new'
          },
          posts: function(){
            return ['somestring', {foo: 'bar'}, true];
          },
          new: sinon.spy()
        });
        this.router = new Router();
        sinon.spy(this.router, 'posts');
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should pass all arguments to the second route.', function(){
        assert(this.router.new.calledWith('somestring', {foo: 'bar'}, true));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained & bracketed route that returns arguments,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/:post_id': '[posts].post'
          },
          posts: function(){
            return ['somestring', {foo: 'bar'}, true];
          },
          post: sinon.spy()
        });
        this.router = new Router();
        sinon.spy(this.router, 'posts');
        Backbone.history.start();
        this.router.navigate('posts/15',{trigger: true});
      });

      it('should append arguments to the second route\'s parameter.', function(){
        assert(this.router.post.calledWith('15', 'somestring', {foo: 'bar'}, true));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained route with multiple parameters,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'post/:post_id/comment/:comment_id': 'post.comment'
          },
          post: sinon.spy(),
          comment: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('post/1/comment/2',{trigger: true});
      });

      it('should pass them as arguments respectively.', function(){
        assert(this.router.post.calledWith('1'));
        assert(this.router.comment.calledWith('2'));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained route using brackets,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/:post_id': '[posts].post'
          },
          posts: sinon.spy(),
          post: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/1',{trigger: true});
      });

      it('should pass the parameter to the second callback.', function(){
        assert(this.router.posts.calledWith(null));
        assert(this.router.post.calledWith('1'));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained route using brackets,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'post/:post_id/comments/:comment_id': 'post.[comments].comment'
          },
          post: sinon.spy(),
          comments: sinon.spy(),
          comment: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('post/1/comments/2',{trigger: true});
      });

      it('should pass parameters to the first and third callbacks.', function(){
        assert(this.router.post.calledWith('1'));
        assert(this.router.comments.calledWith(null));
        assert(this.router.comment.calledWith('2'));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing two chained routes with a shared callback,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/new': 'posts.new',
            'comments/new': 'comments.new'
          },
          posts: sinon.spy(),
          comments: sinon.spy(),
          new: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
        this.router.navigate('comments/new',{trigger: true});
      });

      it('should execute each route once and shared callback twice.', function(){
        expect(this.router.posts).to.have.been.calledOnce;
        expect(this.router.comments).to.have.been.calledOnce;
        expect(this.router.new).to.have.been.calledTwice;
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing two chained routes,', function(){

      before(function(){
        var Router = Backbone.Router.extend({
          routes: {
            'posts/new': 'posts.newPost',
            'comments/new': 'comments.newComment'
          },
          posts: sinon.spy(),
          newPost: sinon.spy(),
          comments: sinon.spy(),
          newComment: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
        this.router.navigate('comments/new',{trigger: true});
      });

      it('should execute each route once.', function(){
        expect(this.router.posts).to.have.been.calledOnce;
        expect(this.router.newPost).to.have.been.calledOnce;
        expect(this.router.comments).to.have.been.calledOnce;
        expect(this.router.newComment).to.have.been.calledOnce;
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });
  });
});