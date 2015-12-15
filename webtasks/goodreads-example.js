var request = require('request');

var key = "GoodReads_Key";

var lookupBook = function(context, req, res) {
  var url = "https://www.goodreads.com/search/index.xml?key=" + key;
  var valid = false;
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
