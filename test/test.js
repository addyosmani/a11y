'use strict';
var test = require('ava');
var a11y = require('../');

process.chdir(__dirname);

function auditsWithHeader(reports, header) {
    return reports.audit.filter(function (aud) {
        return aud.heading === header;
    });
}

test('test that an empty URL fails', function (t) {
    t.throws(function () {
        a11y('', function () {});
    }, /Please supply at least one URL/);
});

test('fail if no callback is supplied', function (t) {
    t.throws(function () {
        a11y('', function () {});
    });
});

test.cb('test local input generates a report if callback is second param', function (t) {
    t.plan(3);

    a11y('fixture.html', function (err, reports) {
        t.ifError(err);
        var ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.is(ariaReports.length, 1);
        t.is(ariaReports[0] && ariaReports[0].result, 'FAIL');
        t.end();
    });
});

test.cb('test local input generates a report if callback is third param', function (t) {
    t.plan(3);

    a11y('fixture.html', null, function (err, reports) {
        t.ifError(err);
        var ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.is(ariaReports.length, 1);
        t.is(ariaReports[0] && ariaReports[0].result, 'FAIL');
        t.end();
    });
});

test.cb('test local input generates a report requiring a delay', function (t) {
    t.plan(3);

    a11y('fixture.html', {delay: 5}, function (err, reports) {
        t.ifError(err);
        var delayReports = auditsWithHeader(reports, 'role=main should only appear on significant elements');
        t.is(delayReports.length, 1);
        t.is(delayReports[0] && delayReports[0].result, 'FAIL');
        t.end();
    });
});

test.cb('test local input generates a verbose report', function (t) {
    t.plan(2);

    a11y('fixture.html', {verbose: true}, function (err, reports) {
        t.ifError(err);
        t.true(reports.report.indexOf('*** Begin accessibility audit results ***') !== -1);
        t.end();
    });
});

test.cb('test local input generates a report that includes all failures for a given violation', function (t) {
    t.plan(3);

    a11y('fixture.html', function (err, reports) {
        t.ifError(err);
        var matchingReports = auditsWithHeader(reports, 'Images should have a text alternative or presentational role');
        t.is(matchingReports.length, 1);
        t.is(matchingReports[0] && matchingReports[0].elements.match(/\n/g).length, 7);
        t.end();
    });
});

test.cb('test it generates a junit report', function (t) {
    t.plan(3);

    a11y('fixture.html', function (err, reports) {
        t.ifError(err);
        t.not(reports.junit, undefined);
        t.regex(reports.junit, /testcase/);
        t.end();
    });
});
