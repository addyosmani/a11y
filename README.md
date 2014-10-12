a11y
===================

Easy accessibility audits powered by the Chrome Accessibility Tools.

## Install

```sh
$ npm install -g a11y
```

*PhantomJS, which is used for generating the screenshots, is installed automagically, but in some [rare cases](https://github.com/Obvious/phantomjs/issues/102) it might fail to and you'll get an `Error: spawn EACCES` error. [Download](http://phantomjs.org/download.html) PhantomJS manually and reinstall pageres if that happens.*


## Usage

```sh
$ a11y <url>
```