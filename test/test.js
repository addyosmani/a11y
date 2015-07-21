'use strict';
var fs =  require('fs');
var spawn = require('child_process').spawn;
var test = require('ava');
var a11y = require('../');

process.chdir(__dirname);


function auditsWithHeader(reports, header) {
    return reports.audit.filter(function(aud) {
        return aud.heading === header;
    });
};

test('test that an empty URL fails', function (t) {
    t.plan(1);
    try {
        a11y('', function () {});
    } catch (e) {
        t.assert(e.toString().indexOf('Please supply at least one URL') > -1);
    }
});

test('fail if no callback is supplied', function (t) {
    t.plan(1);
    try {
        a11y('fixture.html');
    } catch (e) {
        t.assert(true);
    }
});

test('test local input generates a report if callback is second param', function (t) {
    t.plan(2);
    a11y('fixture.html', function (err, reports) {
        var ariaReports = auditsWithHeader(reports ,'ARIA state and property values must be valid');
        t.assert(ariaReports.length === 1);
        t.assert(ariaReports[0] && ariaReports[0].result === 'FAIL');
    });
});

test('test local input generates a report if callback is third param', function (t) {
    t.plan(2);
    a11y('fixture.html', null, function (err, reports) {
        var ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.assert(ariaReports.length === 1);
        t.assert(ariaReports[0] && ariaReports[0].result === 'FAIL');
    });
});

test('test local input generates a report requiring a delay', function (t) {
    t.plan(2);
    a11y('fixture.html', {delay: 5} , function (err, reports) {
        var delayReports = auditsWithHeader(reports, 'role=main should only appear on significant elements');
        t.assert(delayReports.length === 1);
        t.assert(delayReports[0] && delayReports[0].result === 'FAIL');
    });
});

test('test local input generates a verbose report', function (t) {
    t.plan(1);
    a11y('fixture.html', {verbose: true}, function (err, reports) {
        t.assert(reports.report.indexOf('*** Begin accessibility audit results ***') !== -1);
    });
});

test('test local input generates a report that includes all failures for a given violation', function (t) {
    t.plan(2);
    a11y('fixture.html', function (err, reports) {
        var matchingReports = auditsWithHeader(reports, 'This element has an unsupported ARIA attribute');
        t.assert(matchingReports.length === 1);
        t.assert(matchingReports[0] && matchingReports[0].elements.match(/\n/g).length === 6);
    });
});
