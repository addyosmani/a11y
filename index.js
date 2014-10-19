'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var phantomjs = require('phantomjs');
var objectAssign = require('object-assign');

module.exports = function (url, opts, cb) {
    if (typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    if (!url.length > 0) {
      cb('Error: please supply a valid URL as input');
      return;
    }

    opts = objectAssign({}, opts, {url: url});

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

        cb(null, JSON.parse(stdout));
    });
};
