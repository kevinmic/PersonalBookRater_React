import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';
import SearchFilter from './SearchFilter';

var Search = React.createClass({
  propTypes: {
    books: React.PropTypes.object
  },
  render: function() {
    var books = Object.keys(this.props.books).map((bookId) => {
      var book = this.props.books[bookId];
      return <div key={bookId}><BookReview2 bookId={bookId} book={book}/><hr/></div>
    })
    return (
      <div>
        <div className="col-sm-3">
          <SearchFilter/>
        </div>
        <div className="col-sm-9">
          {books}
        </div>
      </div>
    );
  }
});

module.exports = Search;
