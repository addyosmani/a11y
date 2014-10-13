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
var chalk   = require('chalk');
var logSymbols = require('log-symbols');
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
    console.log('Verbose mode:')
    console.log('  $ a11y <url> -f');
}

// Display package version
if ( process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1 ) {
    console.log(pkg.version);
    return;
}

// Display complete output
if ( process.argv.indexOf('-f') !== -1 || process.argv.indexOf('--full') !== -1 ) {
    opts.verbose = true;
}

if( argv.url ){
    opts.url = argv.url;
}

if ( query.indexOf('http') !== -1 ) {
    opts.url = argv._[0];
}

// Display help if no valid URL supplied
if( !opts.url ){
    printHelp();
    return;
}

a11y( opts, function ( err, reports ) {
    if ( err ) {
        console.error( err.message );
        process.exit( err.errcode );
    } else {
        if ( opts.verbose === true ) {
            console.log( reports );
        } else {
            var output = JSON.parse( reports );
            var passes   = "";
            var failures = "";

            output.forEach(function( report ){
                var entry = report;

                if ( entry.result === 'PASS' ) {
                    passes += chalk.green( logSymbols.success + ' ' + entry.heading + '\n' );
                }

                if ( entry.result === 'FAIL' ) {
                    failures += chalk.red( logSymbols.error + ' ' + entry.heading + '\n' );
                }
            });

            console.log( failures );
            console.log( passes );            
        }
    }

});