var x2js = new X2JS();
import firebaseInfo from '../../config/firebase-info.js';
var firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/secureData/goodreads_url");

var patternList = [
  /^(.+)\s+\((.+)[,:;]\s*\#(\d+)\)$/,
  /^(.+)\s+\((.+)[,:;]\s*Book\s+(\d+)\)$/,
  /^(.+)\s+\((.+)[,:;]\s*Book\s+(One|Two|Three|Four|Five|Six|Seven|Eight|Nine)\)$/,
  /^(.+)\s+\((.+)\s+Book\s+(\d+)\)$/,
  /^(.+)\s+\((.+)\s*\#(\d+)\)$/,
];

var parseTitle = function(title) {
  for (var i = 0; i < patternList.length; i++) {
    var regex = patternList[i];
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

var lookupBook = function(name, callback) {
  firebaseRef.on("value", (ref => {
    var url = ref.val() + "&q=" + name;
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
                author:author.name,
              };
          });
        }
        else {
          books = [];
        }

        callback(null, books);
      }
      else {
        callback("Error querying url - " + url, null);
      }
    });
    oReq.open('GET', url, true);
    oReq.send();
  }));

};


module.exports = lookupBook;
