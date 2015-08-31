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
    t.end();
});

test('fail if no callback is supplied', function (t) {
    t.throws(function () {
        a11y('', function () {});
    });
    t.end();
});

test('test local input generates a report if callback is second param', function (t) {
    t.plan(3);

    a11y('fixture.html', function (err, reports) {
        t.error(err);
        var ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.is(ariaReports.length, 1);
        t.is(ariaReports[0] && ariaReports[0].result, 'FAIL');
    });
});

test('test local input generates a report if callback is third param', function (t) {
    t.plan(3);

    a11y('fixture.html', null, function (err, reports) {
        t.error(err);
        var ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.is(ariaReports.length, 1);
        t.is(ariaReports[0] && ariaReports[0].result, 'FAIL');
    });
});

test('test local input generates a report requiring a delay', function (t) {
    t.plan(3);

    a11y('fixture.html', {delay: 5}, function (err, reports) {
        t.error(err);
        var delayReports = auditsWithHeader(reports, 'role=main should only appear on significant elements');
        t.is(delayReports.length, 1);
        t.is(delayReports[0] && delayReports[0].result, 'FAIL');
    });
});

test('test local input generates a verbose report', function (t) {
    t.plan(2);

    a11y('fixture.html', {verbose: true}, function (err, reports) {
        t.error(err);
        t.true(reports.report.indexOf('*** Begin accessibility audit results ***') !== -1);
    });
});

test('test local input generates a report that includes all failures for a given violation', function (t) {
    t.plan(4);

    a11y('fixture.html', function (err, reports) {
        t.error(err);
        var matchingReports = auditsWithHeader(reports, 'Images should have a text alternative or presentational role');
        t.is(matchingReports.length, 1);
        t.is(matchingReports[0] && matchingReports[0].elements.match(/\n/g).length, 7);

        matchingReports = auditsWithHeader(reports, 'Elements with ARIA roles must use a valid, non-abstract ARIA role');
        t.is(matchingReports[0] && matchingReports[0].elements.match(/\n/g).length, 2);
    });
});

test('tests local input on a subsection of the page when a scopeSelector is provided', function (t) {
    t.plan(2);
    a11y('fixture.html', {adtConfigProperties: {scopeSelector: '#subpage'}}, function (err, reports) {
        var matchingReports = auditsWithHeader(reports, 'Elements with ARIA roles must use a valid, non-abstract ARIA role');
        t.is(matchingReports.length, 1);
        t.is(matchingReports[0] && matchingReports[0].elements.match(/\n/g).length, 1);
    });
});
