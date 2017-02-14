'use strict';
const path = require('path');
const execFile = require('child_process').execFile;
const phantomjs = require('phantomjs-prebuilt');
const protocolify = require('protocolify');
const parseJson = require('parse-json');

module.exports = (url, opts, cb) => {
    if (typeof opts !== 'object') {
        cb = opts;
        opts = {};
    }

    opts = opts || {};

    if (typeof cb !== 'function') {
        throw new TypeError('Callback required');
    }

    if (!(url && url.length > 0)) {
        throw new Error('Specify at least one URL');
    }

    const viewportSize = (opts.viewportSize || '').split('x');
    delete opts.viewportSize;

    opts = Object.assign({delay: 1}, opts, {
        url: protocolify(url),
        width: viewportSize[0] || 1024,
        height: viewportSize[1] || 768
    });

    execFile(phantomjs.path, [
        path.join(__dirname, 'audits.js'),
        JSON.stringify(opts),
        '--ignore-ssl-errors=true',
        '--ssl-protocol=tlsv1',
        '--local-to-remote-url-access=true'
    ], (err, stdout) => {
        if (err) {
            cb(err);
            return;
        }

        cb(null, parseJson(stdout));
    });
};
