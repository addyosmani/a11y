#!/usr/bin/env node
'use strict';
var logSymbols = require('log-symbols');
var meow = require('meow');
var a11y = require('./');

var cli = meow({
    help: [
        'Usage',
        '  a11y <url>',
        '',
        'Options',
        '  --verbose    Displays more information'
    ].join('\n')
});

a11y(cli.input[0], cli.flags, function (err, reports) {
    if (err) {
        console.error(err.message);
        process.exit(err.code || 1);
        return;
    }

    if (cli.flags.verbose === true) {
        console.log(reports);
    } else {
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
    }
});
