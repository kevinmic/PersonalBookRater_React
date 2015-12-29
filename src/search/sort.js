var sortByOverallRating = function(books, asc) {
  var booksWithoutReviews = books.filter((book) => _.isEmpty(book.reviews));
  var mappedBooks = books.filter((book) => !_.isEmpty(book.reviews)).map((book) => {
    var ratings = _.values(book.reviews).map((review) => parseInt(review.recommendRating));
    var average = ratings.reduce((prev, next) => prev + next, 0)/ratings.length;
    return {average: average, book: book, title: book.title};
  });

  var sortedBooksWithoutReviews = _.sortByOrder(booksWithoutReviews, 'title', true);
  var sortedBooks = _.sortByOrder(mappedBooks, ['average','title'], asc).map((value) => value.book);

  return sortedBooks.concat(sortedBooksWithoutReviews);
};

var sortIt = function(books, sortType, asc) {
  if (books.length == 0) {
    return books;
  }

  if (sortType == "author" || sortType == "title") {
    return _.sortByOrder(books, [sortType], asc);
  } else {
    if (sortType == "reviewDate") {
      return _.sortByOrder(books, ['latestReviewDate'], ['desc']);
    }
    if (sortType == "overallRating") {
      var booksWithoutReviews = books.filter((book) => _.isEmpty(book.reviews));
      var booksWithReviews = books.filter((book) => !_.isEmpty(book.reviews));
      var part1 = _.sortByOrder(booksWithReviews, ['overallRating', 'reviewDate'], ['desc', 'desc']);
      return part1.concat(booksWithoutReviews);
    }
    if (sortType == "seriesBookNumber") {
      var booksWithoutSeries = books.filter((book) => !book.seriesTitle);
      var booksWithSeries = books.filter((book) => book.seriesTitle);
      var part1 = _.sortByOrder(booksWithSeries, ['seriesTitle', 'seriesBookNumber'], ['asc', 'asc']);
      var part2 = _.sortByOrder(booksWithoutSeries, ['title'], ['asc']);
      return part1.concat(part2);
    }
  }
  console.error("SortType not implemented", sortType);
  return books;
};

module.exports = sortIt;
