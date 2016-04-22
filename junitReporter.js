'use strict';
var junitReportBuilder = require('junit-report-builder');

module.exports = function(url, audit, timestamp, time) {
    var suite = junitReportBuilder.testSuite()
        .name(url)
        .timestamp(timestamp)
        .time(time);
    audit.forEach(function(result) {
        var className = url + '.' + result.code;
        var name = result.elements;
        if(result.result === 'FAIL'){
            var failure = result.heading + ' (' + result.url + ')\n';

            var stacktrace = 'Target: ' + result.elements + '\n\n' +
                'Severity: ' + result.severity + '\n';

            suite.testCase()
                .className(className)
                .name(name)
                .failure(failure)
                .stacktrace(stacktrace);
        }
        if(result.result === 'PASS' || result.result === 'NA'){
            suite.testCase()
                .className(className)
                .name(name);
        }
    });

    return junitReportBuilder.build();
};
