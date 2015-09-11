(function(require) {

  'use strict';

  require.config({
    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '',

    paths: {
      jquery: 'bower_components/jquery/dist/jquery',
      underscore: 'bower_components/underscore/underscore',
      backbone: 'bower_components/backbone/backbone'
    },

    deps: [
      'dist/backbone.chain-router'
    ]
  });

})(require);