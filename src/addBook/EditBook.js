import React from 'react';

import AddBook from './AddBook';

var EditBook = React.createClass({
  propTypes: {
    books : React.PropTypes.object,
    auth: React.PropTypes.object,
    bookId : React.PropTypes.string,
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }

    var book = this.props.books[this.props.bookId];
    if (_.isEmpty(book)) {
      return <div><h3>Book Not Found</h3></div>;
    }
    return <AddBook books={this.props.books} initBook={book} bookId={this.props.bookId} auth={this.props.auth}/>;
  }
});

module.exports = EditBook;
