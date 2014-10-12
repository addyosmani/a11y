#!/bin/env node

/**
 * Binary will be available by executing `npm install a11y -g`
 */

'use strict';

var a11y = require('../lib/index.js');
var axs  = require('accessibility-developer-tools/dist/js/axs_testing.js');
var args = process.argv.slice( 2 );
var opts = {};

if ( args.length < 1 ) {
    console.error( 'A valid URL must be supplied' );
    process.exit(1);
}

opts.url = process.argv[2];

a11y( opts, function ( err, reports ) {
  if ( err ) {
      console.error( err.message );
      process.exit( err.errcode );
  }
  console.log(JSON.parse( reports ));
});