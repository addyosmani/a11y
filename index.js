'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var phantomjs = require('phantomjs-prebuilt');
var objectAssign = require('object-assign');
var protocolify = require('protocolify');
var parseJson = require('parse-json');
var junitReporter = require('./junitReporter');

module.exports = function (url, opts, cb) {
    if (typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    opts = opts || {};

    if (typeof cb !== 'function') {
        throw new Error('Callback required');
    }

    if (!(url && url.length > 0)) {
        throw new Error('Please supply at least one URL');
    }

    var viewportSize = (opts.viewportSize || '').split('x');
    delete opts.viewportSize;

    opts = objectAssign({delay: 1}, opts, {
        url: protocolify(url),
        width: viewportSize[0] || 1024,
        height: viewportSize[1] || 768
    });

    var startTimestamp = Date.now();

    execFile(phantomjs.path, [
        path.join(__dirname, 'audits.js'),
        JSON.stringify(opts),
        '--ignore-ssl-errors=true',
        '--ssl-protocol=tlsv1',
        '--local-to-remote-url-access=true'
    ], function (err, stdout) {
        if (err) {
            cb(err);
            return;
        }

        var endTimestamp = Date.now();
        var duration = endTimestamp - startTimestamp;

        var result = parseJson(stdout);
        result.junit = junitReporter(url, result.audit, endTimestamp, duration);

        cb(null, result);
    });
};
