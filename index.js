'use strict';
var path = require('path');
var execFile = require('child_process').execFile;
var phantomjs = require('phantomjs');
var objectAssign = require('object-assign');
var protocolify = require('protocolify');

module.exports = function (url, opts, cb) {
    if (typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    if (typeof cb !== 'function') {
        throw new Error('Callback required');
    }

    if (!url || !url.length > 0) {
        throw new Error('Please supply a valid URL');
    }

    var viewportSize = {
      width: 1024,
      height: 768
    }

    if (opts && opts.viewportSize) {
        viewportSize = {
          width: opts.viewportSize.split('x')[0],
          height: opts.viewportSize.split('x')[1]
        }
        delete opts.viewportSize
    }

    url = protocolify(url);
    opts = objectAssign({}, opts, {url: url}, viewportSize);

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
