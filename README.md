Redmine Issue Post
=========

Redmine Issue Post is greatly inspired on [IssuePost][1] for [github][2]. In this case, it is aimed at the [redmine][3] bug tracker and allow a user to quickly enter new issues into the tracker without requiring them to open their browser, navigate to the tracker and fill out all the fields.

Motivation
------------

This was developed because we wanted to make better use of redmine and we felt that entering bugs was slowing us down. Thus, we needed a way to rapidly enter those issues so that instead of not creating them, we would add them in our cherished redmine.

Features
--------

* Easy to configure and install
* Quick issue creation into Redmine
* Available on Linux, Mac OS X and Windows

Note that Redmine Issue Post is also compatible with [chiliproject][14]

Requirements
------------

This assumes you have [NPM][13] installed. If not, you can go to http://nodejs.org/ or http://nodejs.org/download/ and download/execute the required installer.

The redmine server you want to submit to must also have **Enable REST web service** enabled (if you are a redmine administrator, you can look under Adminstration > Settings > Authentication).

Install steps
-------------

* Run `npm install`

Usage
-----

* Run `npm start` to execute/start Redmine Issue Post
* Click on the gear in the bottom right corner to bring up the configuration window. From there, simply enter the redmine URL and your redmine api key and then use the ESC key to close the window and save the values.

Supported platforms
-------------------

As this is an application based on [node-webkit][5], it should work on Linux, Mac and Windows.

External dependencies
---------------------

Redmine Issue Post is currently based off various softwares which are either already included when you download Redmine Issue Post or when your run the install steps.

At runtime, the following are used:

* [node-webkit][5]
* [jQuery][6]
* [Lo-Dash][7]
* [Bootstrap][9]

The following tools are quite important to our development process:

* [NPM][13]
* [grunt][10]
* [grunt-contrib-less][11]
* [grunt-contrib-watch][12]

(For a complete list of dependencies, see package.json)

License
-------

The code is licensed under the [MIT license][4]. See license.txt.

  [1]: http://issuepostapp.com/
  [2]: http://www.github.com
  [3]: http://www.redmine.org
  [4]: http://opensource.org/licenses/MIT
  [5]: https://github.com/rogerwang/node-webkit
  [6]: http://jquery.com/
  [7]: http://lodash.com/
  [9]: http://getbootstrap.com/
  [10]: http://gruntjs.com/
  [11]: https://npmjs.org/package/grunt-contrib-less
  [12]: https://npmjs.org/package/grunt-contrib-watch
  [13]: https://npmjs.org/
  [14]: https://www.chiliproject.org/