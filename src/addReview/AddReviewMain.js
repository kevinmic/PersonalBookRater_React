import React from 'react';
var PropTypes = React.PropTypes;
import AddReviewForm from './AddReviewForm';
import BookImage from '../book/BookImage';
import BookData from '../book/BookData';
import TableStyles from '../styles/TableStyles';

var AddReviewMain = React.createClass({
  propTypes: {
    books: React.PropTypes.object,
    auth: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      bookId: "",
    };
  },
  componentDidMount: function() {
    const bookId = this.props.params.bookId
    this.setState({bookId: bookId});
  },
  callback: function() {
    window.location.hash = "#/prevsearch");
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }
    var book = this.props.books[this.state.bookId]
    if (!book) {
      return <div></div>;
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
});

module.exports = AddReviewMain;
