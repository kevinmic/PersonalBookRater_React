import React from 'react';
import { Router, Route, Link, IndexRoute, History} from 'react-router';
var PropTypes = React.PropTypes;

import App from './App';
import SearchMain from './search/SearchMain';
import AddReviewMain from './addReview/AddReviewMain';
import AddBook from './addBook/AddBook';
import books from './defaultData';

var BOOK_SEQ = 5;

var Routes = React.createClass({
  addBook: function(book) {
    BOOK_SEQ = BOOK_SEQ+1;
    var bookId = "key_" + BOOK_SEQ;
    book.bookId = bookId;
    books[bookId] = book;
    return bookId;
  },
  addReview: function(bookId, review) {
    console.log("TRYING TO ADD REVIEW", bookId, review, books[bookId]);
    var book = books[bookId];
    review.reviewedBy = "Not Implemented";
    review.reviewDate = new Date().getTime();
    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(review);
  },
  createElement: function(Component, props) {
    var addProps = {
      books,
      addBook: this.addBook,
      addReview: this.addReview
    }
    Object.assign(props, addProps);
    return <Component {...props}/>
  },
  render: function() {
    return (
      <Router createElement={this.createElement}>
        <Route path="/" component={App}>
          <IndexRoute component={SearchMain}/>
          <Route path="review/search" component={SearchMain}/>
          <Route path="review/:bookId/new" books={books} component={AddReviewMain}/>
          <Route path="book/new" component={AddBook}/>
        </Route>
      </Router>
    );
  }
});

module.exports = Routes;
