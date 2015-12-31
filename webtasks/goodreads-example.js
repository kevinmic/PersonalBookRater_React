var request = require('request');

var key = "GOODREAD_KEY";

var lookupBook = function(context, req, res) {
  var url;
  var valid = false;
  var type = 'search';
  if (context.data.type) {
    type = context.data.type;
  }

  if (type == 'search') {
    url = "https://www.goodreads.com/search/index.xml?key=" + key;
    if (context.data.q) {
      url += "&q=" + context.data.q;
      valid = true;
    }
    if (context.data.page) {
      url += "&page=" + context.data.page;
    }
    if (context.data.search) {
      url += "&search=" + context.data.search;
    }
  }
  else if (type == 'book') {
    url = "https://www.goodreads.com/book/show.xml?key=" + key;
    if (context.data.bookId) {
      url += "&id=" + context.data.bookId;
      valid = true;
    }
  }

  if (valid) {
      request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.writeHead(200, { 'Content-Type': 'text/xml'});
        res.end(body);
      }
      else {
        res.writeHead(500, { 'Content-Type': 'text/plain'});
        res.end("ERROR - [" + url + "] - " + respose.statusCode + " - " + body);
      }
    });
  }
  else {
      res.writeHead(500, { 'Content-Type': 'text/plain'});
      res.end("ERROR, no query");
  }
}

module.exports = lookupBook
