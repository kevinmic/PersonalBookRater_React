import React from 'react';

import AddBook from './AddBook';

var EditBook = React.createClass({
  propTypes: {
    books : React.PropTypes.object
  },
  getInitialState: function() {
    return {
      bookId : ''
    };
  },
  componentDidMount: function() {
    const bookId = this.props.params.bookId
    this.setState({bookId: bookId});
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }

    var book = this.props.books[this.state.bookId];
    if (_.isEmpty(book)) {
      return <div><h3>Book Not Found</h3></div>;
    }
    return <AddBook books={this.props.books} initBook={book} bookId={this.state.bookId} auth={this.props.auth}/>;
  }
});

module.exports = EditBook;
