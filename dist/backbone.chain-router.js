// Backbone.NestedRouter v0.1.0
// ----------------------------------
// (c) 2015 Andrew Henderson
// Backbone Nested Router may be freely distributed under the MIT license.

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self == self && self) ||
    (typeof global == 'object' && global.global == global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      factory(root, Backbone, _);
    });

    // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(root, Backbone, _);

    // Finally, as a browser global.
  } else {
    factory(root, root.Backbone, root._);
  }

}(function(root, Backbone, _) {

  Backbone.Router = Backbone.Router.extend({

    // Overriding route method to account for nested routes
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
        // Handle chained route
      } else if (this.isChained(name)) {
        callback = this.composeChainedRoute(name);
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    isChained: function(name) {
      return name.includes('.');
    },

    getCallbacksArray: function(name){
      var chain = name.split('.');
      // create an array of callback functions
      // must be reversed so routes execute parent then child
      return chain.map(function(name, i){
        // remove any brackets from callback name
        // this way they are found on the router
        if ( /\[/g.test(name) ) {
          name = name.substring(1, name.length - 1);
          this[name].hasBrackets = true;
        }
        return this[name];
      }, this).reverse();
    },

    // Modification of Underscore's compose method
    // (Underscore.js 1.8.3) http://underscorejs.org/#compose
    composeChainedRoute: function(name) {
      var args = this.getCallbacksArray(name);
      var start = args.length - 1;
      return function() {
        var i = start;
        var _args = _.values(arguments);
        var firstArgs;
        if (args[start].hasBrackets) {
          firstArgs = [null];
        } else {
          firstArgs = _args[0] === null ? [null] : [_args[0], null]; // don't pass double null
        }
        var result = args[start].apply(this, firstArgs);
        var newArgs;
        if (!args[start].hasBrackets) {
          newArgs = _args.shift();
        } else {
          newArgs = _args;
        }
        while (i--) {
          if (result) {
            if (_.isArray(newArgs) && newArgs.length > 1 ) {
              newArgs = _.rest(newArgs);
            } else {
              newArgs = [];
            }
            newArgs.push(result);
            newArgs = _.flatten(newArgs);
            if (_.last(newArgs) !== null) newArgs.push(null);
            result = args[i].apply(this, newArgs);
          } else {
            var arg = _args[0];
            newArgs = [arg];
            if (_.isUndefined(newArgs[0])) newArgs = [null];
            if (!_.isNull(newArgs[0])) newArgs.push(null); // don't push two nulls
            if (args[i].hasBrackets) {
              result = args[i].apply(this, [null]);
            } else {
              result = args[i].apply(this, newArgs);
            }
          }
          if (!args[i].hasBrackets) {
            _args.shift();
          }
        }
        return result;
      };
    }
  });
}));