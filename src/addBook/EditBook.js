import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import AddBook from './AddBook';

class EditBook extends React.Component{
  static propTypes = {
    books : PropTypes.object,
    auth: PropTypes.object,
    bookId : PropTypes.string,
  }

  render() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }

    var book = this.props.books[this.props.bookId];
    if (_.isEmpty(book)) {
      return <div><h3>Book Not Found</h3></div>;
    }
    return <AddBook books={this.props.books} initBook={book} bookId={this.props.bookId} auth={this.props.auth}/>;
  }
};

export default EditBook;
