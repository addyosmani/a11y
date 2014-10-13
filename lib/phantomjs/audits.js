/**
 * Conducts audits using the Chrome Accessibility Tools and PhantomJS.
 */

var system = require('system');
var webpage = require('webpage').create();

// Constants
var PAGE_TIMEOUT = 9000;
webpage.settings.resourceTimeout = PAGE_TIMEOUT;
var TOOLS_PATH  = 'node_modules/accessibility-developer-tools/dist/js/axs_testing.js';

// Handle resource access timeout
webpage.onResourceTimeout = function( err ){
    console.log( 'Error code:' +  err.errorCode + ' ' + err.errorString + ' for ' + err.url );
    phantom.exit( 1 );
};

/**
 * @param status
 */
function auditHandler( status ) {
    if ( status === 'success' ) {
        // Inject axs_testing
        webpage.injectJs( TOOLS_PATH );

        var Audit = webpage.evaluate( function () {
            var results = axs.Audit.run();
            var AuditReport = [];

            for ( var i = 0; i < results.length; i++ ) {
                var DOMElements = results[i]['elements'];
                var DOMElementNames = [];

                if ( DOMElements !== undefined ) {
                    for ( var j = 0; j < DOMElements.length; j++ ) {
                        var DOMElement = DOMElements[j];
                        var element = document.createElement( 'div' );
                        element.appendChild( DOMElement );
                        DOMElementNames.push( element );
                    }
                }


                AuditReport.push({
                    heading: results[i]['rule']['heading'],
                    result: results[i]['result'],
                    severity: results[i]['rule']['severity'],
                    elements: results[i]['elements'],
                    elementNames: DOMElementNames
                });
            }

            return AuditReport;
        });

        console.log(JSON.stringify(Audit));
        phantom.exit();

    } else {
        console.log( 'Unable to load ' + url + ' successfully' );
        phantom.exit( 1 );
    }
};

// Validate input and open page for auditing
if ( system.args.length !== 2 ) {
    console.log( 'Please pass a valid URL for auditing' );
    phantom.exit( 1 );
} else {
    var url = system.args[1];
    webpage.open( url, auditHandler );
}
