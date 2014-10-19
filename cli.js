#!/usr/bin/env node
'use strict';
var logSymbols = require('log-symbols');
var meow = require('meow');
var updateNotifier = require('update-notifier');
var each = require('each-async');
var chalk = require('chalk');
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

updateNotifier({
    packageName: cli.pkg.name,
    packageVersion: cli.pkg.version
}).notify();

each(cli.input, function(url){
  a11y(url, cli.flags, function (err, reports) {
      if (err) {
          console.error(err.message);
          process.exit(err.code || 1);
      }

      if (cli.flags.verbose === true) {
          console.log(reports);
      } else {
          var passes = '';
          var failures = '';

          console.log(chalk.green('\nReport for ' + url));
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
});
