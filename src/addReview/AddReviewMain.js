import React from 'react';
import PropTypes from 'prop-types';
import AddReviewForm from './AddReviewForm';
import BookImage from '../book/BookImage';
import BookData from '../book/BookData';
import TableStyles from '../styles/TableStyles';
import {GoToLastSearch} from '../util/GoToHelper';

class AddReviewMain extends React.Component{
  static propTypes = {
    books: PropTypes.object,
    auth: PropTypes.object,
    bookId: PropTypes.string.isRequired,
  }

  callback = () => {
    GoToLastSearch();
  }

  render() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }
    var book = this.props.books[this.props.bookId]
    if (!book) {
      console.log("bookid - " + this.props.bookId)
      return <div>Book Missing</div>;
    }

    return (
      <div style={{width: '800px'}}>
        <h2>Book Review:</h2>
        <table width="100%" style={TableStyles.tableInput}>
          <tbody>
            <tr>
              <td style={{verticalAlign:'top'}}>
                <BookImage book={book}/>
              </td>
              <td>
                <h3>{book.title}</h3>
                <BookData book={book}/>
                <hr/>
                <AddReviewForm {...this.props} book={book} callback={this.callback}/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
};

module.exports = AddReviewMain;
