import React from 'react';
import Login from '../Login';
var PropTypes = React.PropTypes;
import AddReviewForm from './AddReviewForm';
import BookImage from '../book/BookImage';
import BookData from '../book/BookData';
import { History} from 'react-router';
import TableStyles from '../styles/TableStyles';

var AddReviewMain = React.createClass({
  mixins: [History],
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
    this.history.pushState(null, "/review/search");
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <Login redirect={false} message="You must login in order to add a review."/>;
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
