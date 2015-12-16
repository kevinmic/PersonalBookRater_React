import React from 'react';
import lookupBook from './GoodReadsBookLookup';
import AddBook from './AddBook';
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';
import Login from '../Login';
import FormValidationMixins from '../util/FormValidationMixins';
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from '../util/FormField';
var alertify = require('alertify-webpack');

var LookupBook = React.createClass({
  mixins: [FormValidationMixins],
  propTypes: {
    books: React.PropTypes.object,
    auth: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      isManualEntry: false,
      searching: false,
      searchedBooks: [],
      values: {
        title:"",
        author:"",
      },
    };
  },
  searchBooks: function() {
    var {author, title} = this.state.values;
    var {searching} = this.state;

    var search = [];
    if (author) {
      search.push(author);
    }
    if (title) {
      search.push(title);
    }

    if (searching) {
       alertify.log.error("Search in progress");
    }
    else if (search.length > 0) {
      this.setState({searchedBooks: [], searching: true});

      var searchText = search.join(" and ");
      lookupBook(searchText, (error, foundBooks) => {
        if (error) {
          alertify.log.error("Error Querying GoodReads - " + error);
          this.setState({searchedBooks: [], searching: false});
        }
        else if (!foundBooks) {
          alertify.log.error("No Books Found");
          this.setState({searchedBooks: [], searching: false});
        }
        else {
          alertify.log.success(foundBooks.length + " books found!");
          this.setState({searchedBooks: foundBooks, searching: false});
        }
      });
    }
    else {
       alertify.log.error("You must fill in title and/or author");
    }
  },
  chooseBook: function(book) {
    console.log("BOOK", book);
    this.setState({book: book, isManualEntry: true});
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <Login redirect={false} message="You must login in order to add a book."/>;
    }

    if (this.state.isManualEntry) {
      return <AddBook auth={this.props.auth} books={this.props.books} initBook={this.state.book}/>;
    }

    var {values, searchedBooks} = this.state;

    if (searchedBooks && searchedBooks.length > 0) {
      var searchResults = searchedBooks.map((book, index) => {
        return (
          <div key={index}>
            <div className="col-sm-1">
              <button type="button" onClick={() => this.chooseBook(book)}>Choose Book</button>
            </div>
            <BookImage book={book} />
            <BookData book={book} showExtra={false} showTitle={true}/>
            <hr/>
          </div>
        )
      })
    }


    return (
      <div>
      <h3>Lookup Book in GoodReads</h3>
        <form className="form-horizontal" onSubmit={this.searchBooks} onKeyPress={stopEnterSubmitting}>
          <FormFieldInput
            label="Author" id="author"
            data={values}
            onChange={this.onChange}
            isValid={() => true}
            />
          <FormFieldInput
            label="Title" id="title"
            data={values}
            onChange={this.onChange}
            isValid={() => true}
            />
          <button type="button" onClick={this.searchBooks}>Search</button>&nbsp;
          <button type="button" onClick={this.chooseBook}>Manually Add Book</button>
        </form>
        <hr/>
        {searchResults}
      </div>
    )
  }
});

module.exports = LookupBook;
