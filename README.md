Redmine Issue Post
=========

Redmine Issue Post is greatly inspired on [IssuePost][1] for [github][2]. In this case, it is aimed at [redmine][3] bug tracker and allow a user to quickly enter new issues into the tracker without requiring them to open their browser, navigate to the tracker and fill out all the fields.

This was developed because we wanted to make better use of redmine and we felt that entering bugs was slowing us down. Thus, we needed a way to rapidly enter those bugs so that instead of forgetting about them, we'd enter them in our cherished redmine.

Install steps
-------------

* Run `npm install`
* Rename `js/config.js.dist` to `js/config.js` and specify the URL to your redmine website as well as your redmine api key (which you can find by going to `My account` and then on the right under `API access key`, click Show).
* Run `npm start` to execute/start Redmine Issue Post

License
-------

The code is licensed under the [MIT license][4]. See license.txt.


  [1]: http://issuepostapp.com/
  [2]: http://www.github.com
  [3]: http://www.redmine.org
  [4]: http://opensource.org/licenses/MIT