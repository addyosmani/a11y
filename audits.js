/**
 * Conducts audits using the Chrome Accessibility Tools and PhantomJS.
 */
var system = require('system');
var webpage = require('webpage').create();
var url = system.args[1];
var PAGE_TIMEOUT = 9000;
var TOOLS_PATH = 'node_modules/accessibility-developer-tools/dist/js/axs_testing.js';

webpage.settings.resourceTimeout = PAGE_TIMEOUT;

webpage.onResourceTimeout = function (err) {
    console.log('Error code:' +  err.errorCode + ' ' + err.errorString + ' for ' + err.url);
    phantom.exit(1);
};

webpage.open(url, function (status) {
    if (status === 'fail') {
        console.error('Couldn\'t load url: ' + url);
        phantom.exit(1);
    }

    // Inject axs_testing
    webpage.injectJs(TOOLS_PATH);

    var ret = webpage.evaluate(function () {
        var results = axs.Audit.run();

        var audit = results.map(function (result) {
            var DOMElements = result.elements;
            var message = '';

            if (DOMElements !== undefined) {
                var maxElements = Math.min(DOMElements.length, 5);

                for (var i = 0; i < maxElements; i++) {
                    var el = DOMElements[i];
                    message += '\n';
                    // Get query selector not browser independent. catch any errors and
                    // default to simple tagName.
                    try {
                        message += axs.utils.getQuerySelectorText(el);
                    } catch (err) {
                        message += ' tagName:' + el.tagName;
                        message += ' id:' + el.id;
                    }
                }
            }

            return {
                heading: result.rule.heading,
                result: result.result,
                severity: result.rule.severity,
                elements: message
            };
        });

        return {
            audit: audit,
            report: axs.Audit.createReport(results)
        };
    });

    console.log(JSON.stringify(ret));
    phantom.exit();
});
