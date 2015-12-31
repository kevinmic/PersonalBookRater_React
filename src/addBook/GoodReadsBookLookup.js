var x2js = new X2JS();
import firebaseInfo from '../../config/firebase-info.js';
var firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/secureData/goodreads_url");
var WEBTASK_URL;

var loadUrl = function() {
  if (!WEBTASK_URL) {
    firebaseRef.on("value", (ref) => {
      WEBTASK_URL = ref.val();
    });
  }
}

loadUrl();

var seriesPatternList = [
  /^(.+)\s+\((.+)[,:;]\s*\#(\d+)\)$/,
  /^(.+)\s+\((.+)[,:;]\s*Book\s+(\d+)\)$/,
  /^(.+)\s+\((.+)[,:;]\s*Book\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine)\)$/,
  /^(.+)\s+\((.+)\s+Book\s+(\d+)\)$/,
  /^(.+)\s+\((.+)\s*\#(\d+)\)$/,
];

var parseTitle = function(title) {
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
  console.log(descr);
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

var lookupBook = function(grBookId, callback) {
  if (!WEBTASK_URL) {
      callback("Goodreads URL not loaded from Firebase, contact Kevin", null);
      return;
  }

  var url = WEBTASK_URL + "&type=book&bookId=" + grBookId;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", (param) => {
    if (oReq.status == 200) {
      var response = oReq.response;

      var resObj = x2js.xml_str2json(response);
      if (resObj.GoodreadsResponse && resObj.GoodreadsResponse.book) {
        var grBook = resObj.GoodreadsResponse.book;
        console.log("GoodreadsBook", grBook);

        var book = {
          ...parseTitle(grBook.title.__cdata),
          ...parseAuthor(grBook.authors.author),
          imageUrl:parseImage(grBook.small_image_url),
          goodreadsId: grBook.id,
          synopsis: parseDescription(grBook.description.__cdata),
        };

        callback(null, book);
      }

    }
    else {
      callback("Error querying url, contact Kevin - " + url, null);
    }
  });
  oReq.open('GET', url, true);
  oReq.send();
}

var searchBook = function(name, callback) {
  if (!WEBTASK_URL) {
      callback("Goodreads URL not loaded from Firebase, contact Kevin", null);
      return;
  }

  var url = WEBTASK_URL + "&type=search&q=" + name;
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", (param) => {
    if (oReq.status == 200) {
      var response = oReq.response;

      var search = x2js.xml_str2json(response);

      var books;
      if (search.GoodreadsResponse.search.results.work && search.GoodreadsResponse.search.results.work.length > 0) {
        books = search.GoodreadsResponse.search.results.work
          .map((book) => book.best_book)
          .map((book) => {
              // console.log(book);
            var {title, author, small_image_url, id} = book

            return {
              ...parseTitle(title),
              ...parseAuthor(author),
              imageUrl:parseImage(small_image_url),
              goodreadsId: id.__text,
            };
        });
      }
      else {
        books = [];
      }

      callback(null, books);
    }
    else {
      callback("Error querying url, contact Kevin - " + url, null);
    }
  });
  oReq.open('GET', url, true);
  oReq.send();
};


module.exports = {searchBook, lookupBook, loadUrl};
