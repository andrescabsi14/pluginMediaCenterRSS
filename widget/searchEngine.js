'use strict';

var searchEngine = {
  indexFeed: function indexFeed(rssUrl) {
    var _this = this;
    this._get(function (err, result) {
      if (err) throw err;
      console.log(result);
      var feedUrl = result[0] ? result[0].feed_config.url : false;
      if (feedUrl === rssUrl) {
        var options = { searchText: "e" };
        var callback = function callback(e, d) {
          return console.log(e, d.hits);
        };
        buildfire.services.searchEngine.search(options, callback);
        return;
      } else if (!feedUrl) {
        _this._insertFeed(rssUrl);
      } else {
        _this._updateFeed(result[0]._id, rssUrl);
      }
    });
  },
  _insertFeed: function _insertFeed(url, callback) {

    var options = {
      tag: 'rss_feed',
      title: 'rss feed',
      feedType: "rss",
      feedConfig: {
        url: url
      },
      // feedItemConfig: {
      //   uniqueKey: 'id',
      //   titleKey: 'title',
      //   urlKey: 'link',
      //   descriptionKey: 'media:group.media:description'
      // imageUrlKey: "itunes.image"
      // }
    };

    buildfire.services.searchEngine.feeds.insert(options, function (err, result) {
      if (err) {
        if (err.innerError.error === 'invalid unique_key') {
          options.feedItemConfig = { uniqueKey: 'title' };
          buildfire.services.searchEngine.feeds.insert(options, function (err, result) {
            if (err) throw err;
            console.log(result);
          });
        }
      };
      console.log(result);
    });
  },
  _updateFeed: function _updateFeed(feedId, url) {
    var _this2 = this;

    var options = {
      tag: 'rss_feed',
      feedId: feedId,
      removeFeedData: true
    };
    var callback = function callback(e) {
      if (e) throw e;
      _this2._insertFeed(url);
    };
    buildfire.services.searchEngine.feeds.delete(options, callback);
  },
  _get: function _get(callback) {
    buildfire.services.searchEngine.feeds.get({ tag: 'rss_feed', feedType: 'rss' }, function (err, result) {
      callback(err, result);
    });
  }
};