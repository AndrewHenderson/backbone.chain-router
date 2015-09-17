// Backbone.NestedRouter v1.0.0
// ----------------------------------
// (c) 2015 Andrew Henderson
// Backbone Chain Router may be freely distributed under the MIT license.

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

  _.extend(Backbone.Router.prototype, {

    // Override route method to add support for chained routes
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name) || _.isArray(name)) {
        callback = name;
        name = '';
      }
      // Handle chained route
      var routeIsChained = name.indexOf('.') >= 0 || _.isArray(callback);
      if (routeIsChained) {
        var callbacks = this._extractRouteChain(name, callback);
        callback = this._composeRouteChain(callbacks);
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

    // Returns a reversed array of callbacks, marking those with brackets in the name.
    _extractRouteChain: function(name, callbacks){
      var chain = name.split('.');
      if (callbacks) {
        _.each(chain, function (name, i) {
          if (name.indexOf('[') >= 0) {
            callbacks[i].hasBrackets = true; // used later when composing route
          }
        });
      } else {
        callbacks = chain.map(function (name, i) {
          if (name.indexOf('[') >= 0) {
            // Remove brackets from callback name, so it can be located on router.
            name = name.substring(1, name.length - 1);
            this[name].hasBrackets = true; // used later when composing route
          }
          return this[name];
        }, this);
      }
      return callbacks.reverse(); // Reversed so routes execute left to right
    },

    // Similar to Underscore's compose method.
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _composeRouteChain: function(callbacks) {
      var start = callbacks.length - 1;
      return function() {
        var i = start;
        var args = _.values(arguments); // Create a mutatable arguments array
        var firstRoute = callbacks[start];
        var firstArgs = [];
        if (firstRoute.hasBrackets || args[0] === null) {
          // Routes with brackets are not passed fragment params. Start at null.
          firstArgs.push(null);
        } else {
          firstArgs.push(args[0], null); // don't pass double "null"
          args.shift(); // Remove the used argument before calling the next route.
        }
        var result = firstRoute.apply(this, firstArgs);

        while (i--) {
          var nextRoute = callbacks[i];
          if (result) {
            // result should be at front of arguments
            if (args.length >= 2) {
              args = _.initial(args); // A route param was passed, use the param, without "null";
            } else {
              args.shift(); // Otherwise, start with an empty array.
            }
            args.push(result);
            args = _.flatten(args);
            if (!_.isNull(_.last(args))) {
              args.push(null);
            }
            result = nextRoute.apply(this, args);
          } else { // No result returned
            if (_.isUndefined(args[0])) {
              args = [null]; // Ensure each route at least has null as an argument
            }
            if (nextRoute.hasBrackets) {
              result = nextRoute.apply(this, [null]);
            } else {
              result = nextRoute.apply(this, args);
              args.shift();
            }
          }
        }
        return result;
      };
    }
  });
}));