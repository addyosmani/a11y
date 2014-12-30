<img width="400px" src="https://cloud.githubusercontent.com/assets/110953/4694241/3ddba98e-57c1-11e4-852a-dc0940345a89.png">

[![Build Status](http://img.shields.io/travis/addyosmani/a11y/master.svg?style=flat)](https://travis-ci.org/addyosmani/a11y?style=flat) ![](http://img.shields.io/badge/unicorn-approved-ff69b4.svg?style=flat)

> Easy accessibility audits powered by the [Chrome Accessibility Tools](https://www.npmjs.com/package/accessibility-developer-tools).

![](http://i.imgur.com/Mt751vA.png)


## Install

```sh
$ npm install -g a11y
```

*PhantomJS, which is used for generating the screenshots, is installed automagically, but in some [rare cases](https://github.com/Obvious/phantomjs/issues/102) it might fail to and you'll get an `Error: spawn EACCES` error. [Download](http://phantomjs.org/download.html) PhantomJS manually and reinstall `a11y` if that happens.*


## CLI usage

Run an audit against a URL:

```sh
$ a11y todomvc.com
```

or multiple URLs:

```sh
$ a11y http://todomvc.com https://google.com
```


## Example

![](http://i.imgur.com/3xg3Fsf.png)

Also works fine against localhost:

```sh
$ a11y localhost:9000
```

and local files:

```sh
$ a11y index.html
```

![](http://i.imgur.com/Ffkrr9D.png)

## Options

Query help:

```sh
$ a11y --help
```

Customise viewport size:

```sh
$ a11y --viewport-size=800x600
```

Customize page timeout:

```sh
$ a11y --timeout=10000
```

Verbose mode:

```sh
$ a11y <url> --verbose
```

Write audit to file:

```sh
$ a11y <url> > audit.txt
```


## Module usage

Audit a remote URL and generate an accessibility report:

```js
var a11y = require('a11y');

a11y('twitter.com', function (err, reports) {
    var output = JSON.parse(reports);
    var audit = output.audit; // a11y Formatted report
    var report = output.report; // DevTools Accessibility Audit formatted report
});
```

Work with the output of `reports.audit`:

```js
var a11y = require('a11y');

a11y('twitter.com', function (err, reports) {
    reports.audit.forEach(function (el) {
        // result will be PASS, FAIL or NA
        if (el.result === 'FAIL') {
            // el.heading
            // el.severity
            // el.elements
        }
    });
});
```


## Interpreting results

To interpret how to fix individual issues in an audit, see the [Audit Rules](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules) section of the Accessibility Developer Tools project.

Per the Accessibility Developer Tools, the results in an audit may be one of three types:

* `PASS` - implies that there were elements on the page that may potentially have failed this audit rule, but they passed. Congratulations!
* `FAIL` - This implies that there were elements on the page that did not pass this audit rule. This is the only result you will probably be interested in.
* `NA` - This implies that there were no elements on the page that may potentially have failed this audit rule. For example, an audit rule that checks video elements for subtitles would return this result if there were no video elements on the page.

## Integrating a11y into your build

If you use Grunt, [grunt-a11y](https://github.com/lucalanca/grunt-a11y) is a task by João Figueiredo that uses a11y under the hood.

## License

Apache-2.0
