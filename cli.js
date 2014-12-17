#!/usr/bin/env node
'use strict';
var logSymbols = require('log-symbols');
var meow = require('meow');
var updateNotifier = require('update-notifier');
var a11y = require('./');
var chalk = require('chalk');
var each = require('each-async');
var indent = require('indent-string');


var cli = meow({
    help: [
        'Usage',
        '  a11y <url>',
        '',
        'Example',
        '  a11y http://todomvc.com',
        '  a11y http://todomvc.com http://chrome.com',
        '  a11y index.html',
        '',
        'Options',
        '  --verbose                Displays more information',
        '  --viewport-size=1024x768  Sets the viewport size'
    ].join('\n')
});

updateNotifier({
    packageName: cli.pkg.name,
    packageVersion: cli.pkg.version
}).notify();

each(cli.input, function (url) {
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

      console.log(chalk.underline(chalk.cyan('\nReport for ' + url + '\n')));
      reports.audit.forEach(function (el) {
          if (el.result === 'PASS') {
              passes += logSymbols.success + ' ' + el.heading + '\n';
          }

          if (el.result === 'FAIL') {
              failures += logSymbols.error + ' ' + el.heading + '\n';
              failures += el.elements + '\n\n';
          }

      });

      console.log(indent(failures, ' ', 2));
      console.log(indent(passes, ' ', 2));
  });
});
