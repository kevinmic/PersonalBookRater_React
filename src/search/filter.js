import alertify from 'alertifyjs';

var processFilter = (filter, books) => {
  return books.filter((book) => {
    var includeIt = validFilterTypes[filter.type](book, filter.filter);
    if (filter.negate) {
      return !includeIt;
    }
    return includeIt;
  });
}

var filterBooks = function(filterStr, books) {
  if (filterStr) {
    filterStr = filterStr.toLowerCase();
    var filters = filterStr.split(";");

    for (var i = 0; i < filters.length; i++) {
      var filter = parseFilter(filters[i]);
      if (filter.isValid) {
        books = processFilter(filter, books);
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
    retFilter = {isValid: false, type: type, filter: subFilter};
    if (subFilter) {
      if (validFilterTypes[type]) {
        retFilter.isValid = true;
      }
      else {
        alertify.error("Invalid Search Prefix: " + type);
      }
    }
  }

  if (retFilter.filter.indexOf("-") === 0) {
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


export default filterBooks;
