'use strict';
const test = require('ava');
const sinon = require('sinon');

const sandbox = sinon.sandbox.create();
let a11y;

process.chdir(__dirname);

const auditsWithHeader = (reports, header) => reports.audit.filter(x => x.heading === header);

test.beforeEach(() => {
    a11y = require('..');
});

test.afterEach(() => {
    sandbox.restore();
});

test('test that an empty URL fails', t => {
    t.throws(() => {
        a11y('', () => {});
    }, 'Specify at least one URL');
});

test('fail if no callback is supplied', t => {
    t.throws(() => {
        a11y('fixture.html');
    });
});

test.cb('test local input generates a report if callback is second param', t => {
    t.plan(3);

    a11y('fixture.html', (err, reports) => {
        t.ifError(err);
        const ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.is(ariaReports.length, 1);
        t.is(ariaReports[0] && ariaReports[0].result, 'FAIL');
        t.end();
    });
});

test.cb('test local input generates a report if callback is third param', t => {
    t.plan(3);

    a11y('fixture.html', null, (err, reports) => {
        t.ifError(err);
        const ariaReports = auditsWithHeader(reports, 'ARIA state and property values must be valid');
        t.is(ariaReports.length, 1);
        t.is(ariaReports[0] && ariaReports[0].result, 'FAIL');
        t.end();
    });
});

test.cb('test local input generates a report requiring a delay', t => {
    t.plan(3);

    a11y('fixture.html', {delay: 5}, (err, reports) => {
        t.ifError(err);
        const delayReports = auditsWithHeader(reports, 'role=main should only appear on significant elements');
        t.is(delayReports.length, 1);
        t.is(delayReports[0] && delayReports[0].result, 'FAIL');
        t.end();
    });
});

test.cb('test local input generates a verbose report', t => {
    t.plan(2);

    a11y('fixture.html', {verbose: true}, (err, reports) => {
        t.ifError(err);
        t.true(reports.report.indexOf('*** Begin accessibility audit results ***') !== -1);
        t.end();
    });
});

test.cb('test local input generates a report that includes all failures for a given violation', t => {
    t.plan(3);

    a11y('fixture.html', (err, reports) => {
        t.ifError(err);
        const matchingReports = auditsWithHeader(reports, 'Images should have a text alternative or presentational role');
        t.is(matchingReports.length, 1);
        t.is(matchingReports[0] && matchingReports[0].elements.match(/\n/g).length, 7);
        t.end();
    });
});

test.cb('test setting the phantomConfigFile value gets passed to execFile appropriately', t => {
    t.plan(2);
    let childProcess = require('child_process');
    let argsToTest = [];
    sinon.stub(childProcess, 'execFile', (file, args, cb) => {
        argsToTest = args;
        cb(null, '{}');
    });

    // To stub the execFile we need a new a11y each time
    delete require.cache[require.resolve('..')];
    // Need to require this in again
    a11y = require('..');

    a11y('fixture.html', {phantomConfigFile: '/my-config-file.json'}, err => {
        t.ifError(err);
        const lastArgument = argsToTest[argsToTest.length - 1];
        t.is(lastArgument, '--config=/my-config-file.json');
        delete require.cache[require.resolve('..')];
        t.end();
    });
});
