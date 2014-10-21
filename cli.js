#!/usr/bin/env node
'use strict';
var logSymbols = require('log-symbols');
var meow = require('meow');
var updateNotifier = require('update-notifier');
var a11y = require('./');

var cli = meow({
    help: [
        'Usage',
        '  a11y <url>',
        '',
        'Example',
        '  a11y http://todomvc.com',
        '  a11y index.html',
        '',
        'Options',
        '  --verbose    Displays more information'
    ].join('\n')
});

updateNotifier({
    packageName: cli.pkg.name,
    packageVersion: cli.pkg.version
}).notify();

a11y(cli.input[0], cli.flags, function (err, reports) {
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

    reports.audit.forEach(function (el) {
        if (el.result === 'PASS') {
            passes += logSymbols.success + ' ' + el.heading + '\n';
        }

        if (el.result === 'FAIL') {
            failures += logSymbols.error + ' ' + el.heading + '\n';
            failures += el.elements + '\n\n';
        }

    });

    console.log(failures);
    console.log(passes);
});
