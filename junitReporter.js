'use strict';
var junitReportBuilder = require('junit-report-builder');
var path = require('path');

module.exports = function(url, audit, timestamp, time) {
    var builder = junitReportBuilder.newBuilder();

    var fileName = url;
    var isOnFileSystem = fileName.search(/^file:\/\/|^\\/) != -1;
    if (isOnFileSystem) {
        var pathToFile = path.resolve(fileName.replace(/^file:\/\/|^\\/, ''));
        fileName = path.relative(process.cwd(), pathToFile);
    }

    var suite = builder.testSuite()
        .name(fileName)
        .timestamp(timestamp)
        .time(time);
    audit.forEach(function(result) {
        var className = fileName + '.' + result.code;
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

    return builder.build();
};
