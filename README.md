a11y
===================

[![Build Status](http://img.shields.io/travis/addyosmani/a11y/master.svg?style=flat)](https://travis-ci.org/addyosmani/a11y?style=flat) ![](http://img.shields.io/badge/unicorn-approved-ff69b4.svg?style=flat)

Easy accessibility audits powered by the Chrome Accessibility Tools.

![](http://i.imgur.com/IlQk8Mm.png)

## Install

```sh
$ npm install -g a11y
```

*PhantomJS, which is used for generating the screenshots, is installed automagically, but in some [rare cases](https://github.com/Obvious/phantomjs/issues/102) it might fail to and you'll get an `Error: spawn EACCES` error. [Download](http://phantomjs.org/download.html) PhantomJS manually and reinstall pageres if that happens.*

## Usage

```sh
$ a11y <url>
```

```sh
$ a11y --help
```

## Example

```sh
$ a11y http://cnn.com
✘ Controls and media elements should have labels
✘ These elements are focusable but either invisible or obscured by another element
✘ Images should have an alt attribute
✘ Text elements should have a reasonable contrast ratio
✘ Meaningful images should not be used in element backgrounds

✔︎ ARIA state and property values must be valid
✔︎ The purpose of each link should be clear from the link text
✔︎ The web page should have a title that describes topic or purpose
```