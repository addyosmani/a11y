#!/usr/bin/env node
'use strict';
var logSymbols = require('log-symbols');
var meow = require('meow');
var updateNotifier = require('update-notifier');
var chalk = require('chalk');
var eachAsync = require('each-async');
var indentString = require('indent-string');
var arrayUniq = require('array-uniq');
var protocolify = require('protocolify');
var a11y = require('./');

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
        '  --viewport-size=1024x768  Sets the viewport size'
    ].join('\n')
});

updateNotifier({
    packageName: cli.pkg.name,
    packageVersion: cli.pkg.version
}).notify();

var urls = arrayUniq(cli.input.map(function (el) {
    return protocolify(el);
}));

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

      console.log(chalk.underline(chalk.cyan('\n' + url.replace(/^http:\/\//, '') + '\n')));

      reports.audit.forEach(function (el) {
          if (el.result === 'PASS') {
              passes += logSymbols.success + ' ' + el.heading + '\n';
          }

          if (el.result === 'FAIL') {
              failures += logSymbols.error + ' ' + el.heading + '\n';
              failures += el.elements + '\n\n';
          }
      });

      console.log(indentString(failures, ' ', 2));
      console.log(indentString(passes, ' ', 2));

      next();
  });
});
