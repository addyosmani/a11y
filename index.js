'use strict';
var path = require('path');
var phantomjs = require('phantomjs');
var execFile = require('child_process').execFile;

module.exports = function (url, opts, cb) {
    if (typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    execFile(phantomjs.path, [
        '--ignore-ssl-errors=true',
        '--ssl-protocol=tlsv1',
        path.join(__dirname, 'audits.js'),
        url
    ], function (err, stdout) {
        if (err) {
            cb(err);
            return;
        }

        cb(null, JSON.parse(stdout));
    });
};
