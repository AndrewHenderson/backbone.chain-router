// Backbone.Nested-Router.js
// ----------------------------------
// v0.1.0
//
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
      var hasNesting = name.includes('.');
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      } else if (hasNesting) {
        var chain = name.split('.');
        // create an array of callback functions
        // must be reversed
        var callbacks = chain.map(function(name, i){
          return this[chain[i]];
        }, this).reverse();
        callback = this.composeNestedRoute.apply(this, callbacks);
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

    // Modified (Underscore.js 1.8.3) http://underscorejs.org/#compose
    composeNestedRoute: function() {
      var args = arguments;
      var start = args.length - 1;
      return function() {
        var i = start;
        var _args = _.values(arguments);
        var result = args[start].apply(this, [null]);
        while (i--) {
          if (result) {
            var newArr = [];
            newArr.push(result);
            newArr = _.flatten(newArr);
            newArr.push(null);
            result = args[i].apply(this, newArr);
          } else {
            var arg = _args[0];
            var newArr = newArr = [arg];
            if (!_.isNull(arg)) newArr.push(null);
            result = args[i].apply(this, newArr);
          }
          _args.shift();
        }
        return result;
      };
    }

  });
}));