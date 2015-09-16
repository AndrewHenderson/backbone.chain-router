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
        assert(this.router.posts.calledWith(null));
        expect(this.router.new).to.have.been.calledOnce;
        assert(this.router.new.calledWith(null));
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
          posts: sinon.spy(function(){
            return 'somestring';
          }),
          new: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should pass the argument to the second route.', function(){
        assert(this.router.posts.calledWith(null));
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
          posts: sinon.spy(function(){
            return ['somestring', {foo: 'bar'}, true];
          }),
          new: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should pass all arguments to the second route.', function(){
        assert(this.router.posts.calledWith(null));
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
          posts: sinon.spy(function(){
            return ['somestring', {foo: 'bar'}, true];
          }),
          new: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should pass all arguments to the second route.', function(){
        assert(this.router.posts.calledWith(null));
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
          posts: sinon.spy(function(){
            return ['somestring', {foo: 'bar'}, true];
          }),
          post: sinon.spy()
        });
        this.router = new Router();
        Backbone.history.start();
        this.router.navigate('posts/15',{trigger: true});
      });

      it('should append arguments to the second route\'s parameter.', function() {
        assert(this.router.posts.calledWith(null));
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
        assert(this.router.posts.calledWith(null));
        expect(this.router.comments).to.have.been.calledOnce;
        assert(this.router.comments.calledWith(null));
        expect(this.router.new).to.have.been.calledTwice;
        assert(this.router.new.calledWith(null));
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
        assert(this.router.posts.calledWith(null));
        expect(this.router.newPost).to.have.been.calledOnce;
        assert(this.router.newPost.calledWith(null));
        expect(this.router.comments).to.have.been.calledOnce;
        assert(this.router.comments.calledWith(null));
        expect(this.router.newComment).to.have.been.calledOnce;
        assert(this.router.newComment.calledWith(null));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a manually defined chained route with two callbacks,', function(){

      before(function(){
        var Router = Backbone.Router.extend({});
        this.router = new Router();
        this.callback1 = sinon.spy(function(){
          return 'somestring';
        });
        this.callback2 = sinon.spy();
        this.router.route('posts/new', 'posts.new', [this.callback1, this.callback2]);
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should execute each callback once.', function(){
        expect(this.callback1).to.have.been.calledOnce;
        assert(this.callback1.calledWith(null));
        expect(this.callback2).to.have.been.calledOnce;
        assert(this.callback2.calledWith('somestring'));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing an anonymous manually defined chained route with two callbacks,', function(){

      before(function(){
        var Router = Backbone.Router.extend({});
        this.router = new Router();
        this.callback1 = sinon.spy(function(){
          return 'somestring';
        });
        this.callback2 = sinon.spy();
        this.router.route('posts/new', [this.callback1, this.callback2]);
        Backbone.history.start();
        this.router.navigate('posts/new',{trigger: true});
      });

      it('should execute each callback once.', function(){
        expect(this.callback1).to.have.been.calledOnce;
        assert(this.callback1.calledWith(null));
        expect(this.callback2).to.have.been.calledOnce;
        assert(this.callback2.calledWith('somestring'));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });

    describe('when executing a chained & bracketed route that returns arguments,', function(){

      before(function(){
        var Router = Backbone.Router.extend({});
        this.router = new Router();
        this.postsRoute = sinon.spy(function(){
          return ['somestring', {foo: 'bar'}, true];
        });
        this.newRoute = sinon.spy();
        this.router.route('posts/:id', '[posts].new', [this.postsRoute, this.newRoute]);
        Backbone.history.start();
        this.router.navigate('posts/34',{trigger: true});
      });

      it('should pass all arguments to the second route.', function(){
        assert(this.postsRoute.calledWith(null));
        assert(this.newRoute.calledWith('34', 'somestring', {foo: 'bar'}, true));
      });

      after(function(){
        this.router.navigate('',{trigger: true});
        Backbone.history.stop();
      });
    });
  });
});