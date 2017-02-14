#!/usr/bin/env node
'use strict';
const logSymbols = require('log-symbols');
const meow = require('meow');
const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const eachAsync = require('each-async');
const indentString = require('indent-string');
const globby = require('globby');
const protocolify = require('protocolify');
const humanizeUrl = require('humanize-url');
const a11y = require('.');

const cli = meow(`
    Usage
      $ a11y <url>

    Options
      --viewport-size=<size>  Set the viewport size
      --delay                 Set the delay capturing the page
      --verbose               Display more information

    Examples
      $ a11y todomvc.com
      $ a11y http://todomvc.com https://google.com
      $ a11y index.html -=viewport-size=1024x768
`);

updateNotifier({pkg: cli.pkg}).notify();

if (cli.input.length === 0) {
    console.error('Specify at least one URL');
    process.exit(1);
}

// Parse the CLI input into valid paths using glob and protocolify
const urls = globby.sync(cli.input, {
    // Ensure not-found paths (like "google.com"), are returned
    nonull: true
}).map(protocolify);

eachAsync(urls, (url, i, next) => {
    a11y(url, cli.flags, (err, reports) => {
        if (err) {
            console.error(err.message);
            process.exit(err.code || 1);
        }

        if (cli.flags.verbose) {
            console.log(reports);
            return;
        }

        let passes = '';
        let failures = '';

        console.log('');

        if (!process.stdout.isTTY || urls.length > 1) {
            console.log(chalk.underline(chalk.cyan(humanizeUrl(url) + '\n')));
        }

        for (const el of reports.audit) {
            if (el.result === 'PASS') {
                passes += `${logSymbols.success} ${el.heading}\n`;
            }

            if (el.result === 'FAIL') {
                process.exitCode = 1;
                failures += `${logSymbols.error} ${el.heading}\n`;
                failures += `${el.elements}\n\n`;
            }
        }

        console.log(indentString(failures, 2));
        console.log(indentString(passes, 2));

        next();
    });
});
