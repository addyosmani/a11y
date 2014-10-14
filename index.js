/**
 * Wrapper for working with PhantomJS
 */

var path = require('path');
var phantomjs = require('phantomjs');
var binaryPath = phantomjs.path;
var spawnprocess = require('child_process').spawn;
var AUDITS_SCRIPT = path.join( __dirname, 'audits.js' );

module.exports = function ( opts, cb ) {
    var argsForScript = [opts.url];
    var subArgs = ['--ignore-ssl-errors=true', '--ssl-protocol=tlsv1', AUDITS_SCRIPT].concat(argsForScript);
    var out = "";
    var err = "";
    var cp;

    cp = spawnprocess( binaryPath, subArgs );

    cp.on( 'error' , function( err ) {
        console.error( 'Error:', binaryPath, err.stack );
        cb( err );
    });

    cp.stdout.on( 'data' , function( data ) {
        out += data;
    });

    cp.stderr.on( 'data', function( data ) {
        err += data;
    });

    cp.on( 'close' , function( errCode ) {
        if ( errCode !== 0 ) {
            console.log( 'Process closed with code' + errCode );
        }
    });

    cp.on( 'exit' , function( errCode ) {
        if ( errCode === 0 ) {
            cb( null , out );
        } else {
            console.error( 'PhantomJS process exited with code ' + errCode );
            cb({ code: errCode, message: err });
        }
    });
};
