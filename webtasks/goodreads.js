/**
* @param context {WebtaskContext}
*/

var parser = require('xml2json');
var request = require('request');

var key = "LOOK_ME_UP";
var goodreadsUrl = "https://www.goodreads.com"

var seriesPatternList = [
  /^(.+)\s+\((.+)[,:;]\s*\#(\d+)\)$/,
  /^(.+)\s+\((.+)[,:;]\s*Book\s+(\d+)\)$/,
  /^(.+)\s+\((.+)[,:;]\s*Book\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine)\)$/,
  /^(.+)\s+\((.+)\s+Book\s+(\d+)\)$/,
  /^(.+)\s+\((.+)\s*\#(\d+)\)$/,
];

var parseTitle = function(title) {
  if (typeof title !== 'string') {
    title = title.__cdata;
  }
  for (var i = 0; i < seriesPatternList.length; i++) {
    var regex = seriesPatternList[i];
    var match = title.match(regex);
    if (match) {
      // console.log("MATCH", regex, title);
      return {title: match[1], seriesTitle:match[2], seriesBookNumber:match[3]}
    }
  }
  return {title: title, seriesTitle:"", seriesBookNumber:""}
};

var parseAuthor = function(author) {
  var index = author.name.lastIndexOf(" ");
  return {author: author.name.slice(index + 1, author.name.length) + ", " + author.name.slice(0, index)};
};

var descriptionPatternList = [
  {tag: "br", replace:"\n"},
  {tag: "em", replace:"_"},
  {tag: "strong",replace:"__"},
];

var parseDescription = function(descr) {
  if (typeof descr !== 'string') {
    descr = descr.__cdata;
  }
  for (var i = 0; i < descriptionPatternList.length; i++) {
    var pat = descriptionPatternList[i];
    descr = descr.replace(new RegExp("\<" + pat.tag + "\>", "gi"), pat.replace);
    descr = descr.replace(new RegExp("\<" + pat.tag + "\/\>", "gi"), pat.replace);
    descr = descr.replace(new RegExp("\<\/" + pat.tag + "\>", "gi"), pat.replace);
  }
  return descr + "\n<sub><sup>(Description From GoodReads.com)</sup></sub>";
}

var parseImage = function(image) {
  if (image) {
    if (image.indexOf("nophoto") > 0) {
      image = "";
    }
    else {
      var index = image.lastIndexOf("s");
      // I want the medium sized image
      image = image.slice(0, index) + "m" + image.slice(index + 1);
    }
  }
  return image;
};

var parseSearch = function(search) {
  if (search.GoodreadsResponse.search.results.work && search.GoodreadsResponse.search.results.work.length > 0) {
    return search.GoodreadsResponse.search.results.work
      .map((book) => book.best_book)
      .map((book) => {
          // console.log(book);
        var {title, author, small_image_url, id} = book

        console.log("BOOK INFO", title, small_image_url);
        return {
          ...parseTitle(title),
          ...parseAuthor(author),
          imageUrl:parseImage(small_image_url),
          goodreadsId: id.$t,
        };
    });
  }
  return [];
};

var runSearch = function(query, cb) {
  var path = "";
  if (!query.q) {
    cb("Missing Query Param");
  }
  else {
    var params = [`q=${query.q}`];
    if (query.page) {
      params.push(`page=${query.page}`);
    }
    if (query.search) {
      params.push(`search=${query.search}`);
    }
  
    runGoodreadsRequest('/search/index.xml', params, (err, json) => {
      if (err) {
        cb(err);
      }
      else {
        cb(null, parseSearch(json));
      }
    });
  
  }
};

var runBookLookup = function(bookId, cb) {
  if (bookId) {
    runGoodreadsRequest('/book/show.xml', [`id=${bookId}`], (err, json) => {
      if (err) {
        cb(err);
      }
      else {
        if (json.GoodreadsResponse && json.GoodreadsResponse.book) {
          var grBook = json.GoodreadsResponse.book;
          cb(null, {
            ...parseTitle(grBook.title),
            ...parseAuthor(grBook.authors.author),
            imageUrl:parseImage(grBook.small_image_url),
            goodreadsId: grBook.id,
            synopsis: parseDescription(grBook.description),
          });
        }
        else {
          cb("Book not found");
        }
      }
    });
  }
  else {
    cb("Missing BookId");
  }
};

var runGoodreadsRequest = function(urlPath, queryParams, cb) {
  var params = queryParams;
  params.push(`key=${key}`);
  var url = goodreadsUrl + urlPath + '?' + params.join('&');
  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var json = JSON.parse(parser.toJson(body));
      
      cb(null, json);
    }
    else {
      cb("ERROR - [" + url + "] - " + response.statusCode + " - " + body);
    }
  });
};

var handleRequest = function(context, cb) {
  key = context.secrets.goodreads_key;
  if (context.query.type === 'book') {
    runBookLookup(context.query.bookId, cb);
  }
  else {
    runSearch(context.query, cb);
  }
}

module.exports = handleRequest
