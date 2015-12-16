var sortByReviewDate = function(books,asc) {
  var booksWithoutReviews = books.filter((book) => !book.reviews);
  var mappedBooks = books.filter((book) => book.reviews).map((book) => {
    var maxTime = _.values(book.reviews).map((review) => review.reviewDate).reduce((prev,next) => (prev < next)?next:prev);
    return {maxTime: maxTime, book: book, title: book.title};
  });

  var sortedBooksWithoutReviews = _.sortByOrder(booksWithoutReviews, 'title', true);
  var sortedBooks = _.sortByOrder(mappedBooks, ['maxTime','title'], asc).map((value) => value.book);

  return sortedBooks.concat(sortedBooksWithoutReviews);
};

var sortByOverallRating = function(books, asc) {
  var booksWithoutReviews = books.filter((book) => !book.reviews);
  var mappedBooks = books.filter((book) => book.reviews).map((book) => {
    var ratings = _.values(book.reviews).map((review) => parseInt(review.recommendRating));
    var average = ratings.reduce((prev, next) => prev + next, 0)/ratings.length;
    return {average: average, book: book, title: book.title};
  });

  var sortedBooksWithoutReviews = _.sortByOrder(booksWithoutReviews, 'title', true);
  var sortedBooks = _.sortByOrder(mappedBooks, ['average','title'], asc).map((value) => value.book);

  return sortedBooks.concat(sortedBooksWithoutReviews);
};

var sortIt = function(books, sortType, asc) {
  if (sortType == "author" || sortType == "title") {
    return _.sortByOrder(_.values(books), [sortType], asc);
  } else {
    if (sortType == "reviewDate") {
      return sortByReviewDate(books, asc);
    }
    if (sortType == "overallRating") {
      return sortByOverallRating(books, asc);
    }
  }
  console.error("SortType not implemented", sortType);
  return books;
};

module.exports = sortIt;
