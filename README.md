# a11y

[![Build Status](http://img.shields.io/travis/addyosmani/a11y/master.svg?style=flat)](https://travis-ci.org/addyosmani/a11y?style=flat) ![](http://img.shields.io/badge/unicorn-approved-ff69b4.svg?style=flat)

> Easy accessibility audits powered by the Chrome Accessibility Tools.

![](http://i.imgur.com/4jHgzDL.png)


## Install

```sh
$ npm install -g a11y
```

*PhantomJS, which is used for generating the screenshots, is installed automagically, but in some [rare cases](https://github.com/Obvious/phantomjs/issues/102) it might fail to and you'll get an `Error: spawn EACCES` error. [Download](http://phantomjs.org/download.html) PhantomJS manually and reinstall `a11y` if that happens.*


## CLI usage

Run an audit against a URL:

```sh
$ a11y <url>
```


## Example

![](http://i.imgur.com/lNG4fyB.png)

Query help:

```sh
$ a11y --help
```

Verbose mode:

```sh
$ a11y <url> --verbose
```


## Module usage

```js
var a11y = require('a11y');

a11y('http://twitter.com', function (err, reports) {
    var output = JSON.parse(reports);
    var audit = output.audit; // a11y Formatted report
    var report = output.report; // DevTools Accessibility Audit formatted report
});
```
