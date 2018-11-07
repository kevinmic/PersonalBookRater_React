import _ from 'lodash';

var sortIt = function(books, sortType, asc) {
  if (books.length === 0) {
    return books;
  }

  if (sortType === "author" || sortType === "title") {
    return _.orderBy(books, [sortType], [asc]);
  } else {
    if (sortType === "reviewDate") {
      return _.orderBy(books, ['latestReviewDate'], ['desc']);
    }
    if (sortType === "overallRating") {
      var booksWithoutReviews = books.filter((book) => _.isEmpty(book.reviews));
      var booksWithReviews = books.filter((book) => !_.isEmpty(book.reviews));
      var orderedWithReviews= _.orderBy(booksWithReviews, ['overallRating', 'latestReviewDate'], ['desc', 'desc']);
      return orderedWithReviews.concat(booksWithoutReviews);
    }
    if (sortType === "seriesBookNumber") {
      var booksWithoutSeries = books.filter((book) => !book.seriesTitle);
      var booksWithSeries = books.filter((book) => book.seriesTitle);
      var part1 = _.orderBy(booksWithSeries, ['seriesTitle', 'seriesBookNumber'], ['asc', 'asc']);
      var part2 = _.orderBy(booksWithoutSeries, ['title'], ['asc']);
      return part1.concat(part2);
    }
  }
  console.error("SortType not implemented", sortType);
  return books;
};

export default sortIt;
