import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';


      // <ol>
      //   <li>Title</li>
      //   <li>Author</li>
      //   <li>Series</li>
      //   <li>Overall Rating</li>
      // </ol>

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
        {books}
      </div>
    );
  }
});

module.exports = Search;
