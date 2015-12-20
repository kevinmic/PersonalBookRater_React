var alertify = require('alertify-webpack');

var filterBooks = function(filterStr, books) {
  if (filterStr) {
    filterStr = filterStr.toLowerCase();
    var filters = filterStr.split(";");
    for (var i = 0; i < filters.length; i++) {
      var filter = parseFilter(filters[i]);
      // console.log("filter", filter);
      if (filter.isValid) {
        books = books.filter((book) => {
          var includeIt = validFilterTypes[filter.type](book, filter.filter);
          if (filter.negate) {
            return !includeIt;
          }
          return includeIt;
        });
      }
    }
  }
  return books;
};

var filterSeries = function(book, filter) {
    if (book.seriesTitle && book.seriesTitle.toLowerCase().indexOf(filter) >=0) {
      return true;
    }
    return false;
}

var filterTitle = function(book, filter) {
    if (book.title.toLowerCase().indexOf(filter) >=0) {
      return true;
    }
    return false;
}

var filterAuthor = function(book, filter) {
    if (book.author.toLowerCase().indexOf(filter) >=0) {
      return true;
    }
    return false;
}

var filterAll = function(book, filter) {
    if (book.title.toLowerCase().indexOf(filter) >=0) {
      return true;
    }
    if (book.author.toLowerCase().indexOf(filter) >=0) {
      return true;
    }
    if (book.seriesTitle && book.seriesTitle.toLowerCase().indexOf(filter) >=0) {
      return true;
    }
    return false;
}

var parseFilter = function(filter) {
  if (!filter || !filter.trim()) {
    return {isValid: false};
  }
  filter = filter.trim();

  var retFilter = {isValid: true, type: "all", filter: filter, negate: false};

  var match = filter.match(/(.+):\s*(.*)/);
  if (match) {
    var type = match[1];
    var subFilter = match[2].trim();
    var retFilter = {isValid: false, type: type, filter: subFilter};
    if (subFilter) {
      if (validFilterTypes[type]) {
        retFilter.isValid = true;
      }
      else {
        alertify.log.error("Invalid Search Prefix: " + type);
      }
    }
  }

  if (retFilter.filter.indexOf("-") == 0) {
    retFilter.negate=true;
    retFilter.filter=retFilter.filter.slice(1);
  }
  return retFilter;
}

const validFilterTypes = {
  "all": filterAll,
  "author": filterAuthor,
  "title": filterTitle,
  "series": filterSeries,
}


module.exports = filterBooks;
