'use strict';
var fs =  require('fs');
var spawn = require('child_process').spawn;
var test = require('ava');
var A11y = require('../');

process.chdir(__dirname);

test('expose a constructor', function (t) {
  t.plan(1);
  t.assert(typeof A11y === 'function');
});

test('test that an empty URL fails', function (t) {
  t.plan(1);
  var a11y = new A11y('', null, function (err, reports) {
    t.assert(err === 'Error: please supply a valid URL as input');
  });
});

test('fail if no no callback is supplied', function (t) {
  t.plan(1);
  try {
    var a11y = new A11y('', null);
  } catch (e) {
    // TODO: Supply a better error message
    t.assert(e.toString().indexOf('TypeError: undefined is not a function') > -1);
  }
});

test('test local input generates a report if callback is second param', function (t) {
  t.plan(2);
  var a11y = new A11y('fixture.html', function (err, reports) {
    t.assert(reports.audit[1].heading === 'ARIA state and property values must be valid');
    t.assert(reports.audit[1].result === 'FAIL');
  });
});

test('test local input generates a report if callback is third param', function (t) {
  t.plan(2);
  var a11y = new A11y('fixture.html', null, function (err, reports) {
    t.assert(reports.audit[1].heading === 'ARIA state and property values must be valid');
    t.assert(reports.audit[1].result === 'FAIL');
  });
});

test('test local input generates a verbose report', function (t) {
  t.plan(1);
  var a11y = new A11y('fixture.html', { verbose: true} , function (err, reports) {
    t.assert(reports.report.indexOf('*** Begin accessibility audit results ***') > -1);
  });
});
