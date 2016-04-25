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
        var name = result.code;
        if(result.result === 'FAIL'){
            var failure = result.heading + ' (' + result.url + ')\n';

            var stacktrace = 'Severity: ' + result.severity + '\n\n'+
                'Target:\n' +
                result.elements.replace(/\n/g, '\n    \u2022 ');

            suite.testCase()
                .name(name)
                .failure(failure)
                .stacktrace(stacktrace);
        }
        if(result.result === 'PASS' || result.result === 'NA'){
            suite.testCase()
                .name(name);
        }
    });

    return builder.build();
};
