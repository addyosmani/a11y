#!/usr/bin/env node
'use strict';
var logSymbols = require('log-symbols');
var meow = require('meow');
var updateNotifier = require('update-notifier');
var chalk = require('chalk');
var eachAsync = require('each-async');
var indentString = require('indent-string');
var globby = require('globby');
var protocolify = require('protocolify');
var humanizeUrl = require('humanize-url');
var a11y = require('./');
var exitCode = 0;

var cli = meow({
    help: [
        'Usage',
        '  a11y <url>',
        '',
        'Example',
        '  a11y todomvc.com',
        '  a11y http://todomvc.com https://google.com',
        '  a11y index.html',
        '',
        'Options',
        '  --verbose                 Displays more information',
        '  --viewport-size=1024x768  Sets the viewport size',
        '  --delay                   Sets the delay capturing the page',
        '  --fail-on-error           Exits with an error code on audit failures'
    ]
});

updateNotifier({pkg: cli.pkg}).notify();

if (cli.input.length === 0) {
    console.error('Please supply at least one URL');
    process.exit(1);
}

if (cli.flags.failOnError === true) {
    process.on('beforeExit', function(code) {
        process.exit(exitCode)
    });
}

// Parse the CLI input into valid paths using glob and protocolify.
var urls = globby.sync(cli.input, {
    // Ensure not-found paths (like "google.com"), are returned.
    nonull: true
}).map(protocolify);

eachAsync(urls, function (url, i, next) {
    a11y(url, cli.flags, function (err, reports) {
        if (err) {
            console.error(err.message);
            process.exit(err.code || 1);
        }

        if (cli.flags.verbose) {
            console.log(reports);
            return;
        }

        var passes = '';
        var failures = '';

        console.log('');

        if (!process.stdout.isTTY || urls.length > 1) {
            console.log(chalk.underline(chalk.cyan(humanizeUrl(url) + '\n')));
        }

        reports.audit.forEach(function (el) {
            if (el.result === 'PASS') {
                passes += logSymbols.success + ' ' + el.heading + '\n';
            }

            if (el.result === 'FAIL') {
                exitCode = 1;
                failures += logSymbols.error + ' ' + el.heading + '\n';
                failures += el.elements + '\n\n';
            }
        });

        console.log(indentString(failures, ' ', 2));
        console.log(indentString(passes, ' ', 2));

        next();
    });
});
