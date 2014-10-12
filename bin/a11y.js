#!/usr/bin/env node
'use strict';
/**
 * Binary will be available by executing `npm install a11y -g`
 */

// Awesome internal and external libs
var a11y    = require('../lib/index.js');
var axs     = require('accessibility-developer-tools/dist/js/axs_testing.js');
var pkg     = require('../package.json');
var argv    = require('minimist')((process.argv.slice(2)));
var query   = process.argv[2];
var opts = {};

process.title = 'a11y';

/**
 * Display CLI help
 */
function printHelp() {
    console.log(pkg.description);
    console.log('');
    console.log('Usage:');
    console.log('  $ a11y <url>');
    console.log('');
}

// Display package version
if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
    console.log(pkg.version);
    return;
}

if(argv.url){
    opts.url = argv.url;
}

if (query.indexOf('http') !== -1) {
    opts.url = argv._[0];
}

// Display help if no valid URL supplied
if(!opts.url){
    printHelp();
    return;
}

a11y( opts, function (err, reports) {
    if ( err ) {
        console.error(err.message);
        process.exit(err.errcode);
    }
    console.log(JSON.parse(reports));

});