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
      if (_.isFunction(name) || _.isArray(name)) {
        callback = name;
        name = '';
      }
      // Handle chained route
      if (this.isChained(name) || _.isArray(callback)) {
        callback = this.composeChainedRoute(name, callback);
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
      return name.indexOf('.') >= 0;
    },

    getCallbacksArray: function(name){
      var chain = name.split('.');
      return chain.map(function(name, i){
        if ( name.indexOf('[') >= 0 ) {
          // remove any brackets from callback name
          // so it can be located as a callback on router
          name = name.substring(1, name.length - 1);
          this[name].hasBrackets = true; // boolean used when composing route
        }
        return this[name];
      }, this).reverse(); // must be reversed so routes execute left to right
    },

    // Modification of Underscore's compose method
    // (Underscore.js 1.8.3) http://underscorejs.org/#compose
    composeChainedRoute: function(name, callbacks) {
      var args = _.isArray(callbacks) ? callbacks : this.getCallbacksArray(name);
      var start = args.length - 1;
      return function() {
        var i = start;
        var _args = _.values(arguments); // create a mutatable array
        var firstArgs = [];
        if (args[start].hasBrackets || _args[0] === null) {
          firstArgs.push(null); // Routes with brackets are not passed fragment params. Start at null.
        } else {
          firstArgs.push(_args[0], null); // don't pass double null
        }
        var firstRoute = args[start];
        var result = firstRoute.apply(this, firstArgs);
        var nextArgs = _args;
        if (!firstRoute.hasBrackets) {
          nextArgs.shift(); // Remove first argument from non-bracketed routes
        }
        while (i--) {
          if (result) {
            if (_.isNull(nextArgs[0]) || _.isUndefined(nextArgs[0])) {
              nextArgs = []; // remove null since the result should be at front of arguments
            } else if (nextArgs.length > 1 && _.last(nextArgs) === null) {
              nextArgs = _.initial(nextArgs);
            }
            nextArgs.push(result);
            nextArgs = _.flatten(nextArgs);
            if (_.last(nextArgs) !== null) nextArgs.push(null);
            result = args[i].apply(this, nextArgs);
          } else {
            var arg = _args[0];
            nextArgs = [arg];
            if (_.isUndefined(nextArgs[0])) nextArgs = [null];
            if (!_.isNull(nextArgs[0])) nextArgs.push(null); // don't push two nulls
            if (args[i].hasBrackets) {
              result = args[i].apply(this, [null]);
            } else {
              result = args[i].apply(this, nextArgs);
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