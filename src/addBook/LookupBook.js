import React from 'react';
import PropTypes from 'prop-types';

import GoodReads from './GoodReadsBookLookup';
import AddBook from './AddBook';
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';
import FormValidationMixins from '../util/FormValidationMixins';
import TableStyles from '../styles/TableStyles';
import {AutoSuggestFormField, FormField, FormFieldSubmit, FormTable, FormFieldInput, stopEnterSubmitting} from '../util/FormFieldTable';

class LookupBook extends React.Component{
  static propTypes = {
    books: PropTypes.object,
    auth: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      isManualEntry: false,
      searching: false,
      searchedBooks: [],
      values: {
        title:"",
        author:"",
      },
    };

    FormValidationMixins.addAndBind(this);
  }

  searchBooks = () => {
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
       alertify.error("Search in progress");
    }
    else if (search.length > 0) {
      alertify.log("Searching");
      this.setState({searchedBooks: [], searching: true});

      var searchText = search.join(" and ");
      GoodReads.searchBook(searchText, (error, foundBooks) => {
        if (error) {
          alertify.error("Error Querying GoodReads - " + error);
          this.setState({searchedBooks: [], searching: false});
        }
        else if (!foundBooks) {
          alertify.error("No Books Found");
          this.setState({searchedBooks: [], searching: false});
        }
        else {
          alertify.success(foundBooks.length + " books found!");
          this.setState({searchedBooks: foundBooks, searching: false});
        }
      });
    }
    else {
       alertify.error("You must fill in title and/or author");
    }
  }

  chooseBook = (book) => {
    this.setState({book: book, isManualEntry: true});
  }

  render() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }

    if (this.state.isManualEntry) {
      return <AddBook auth={this.props.auth} books={this.props.books} initBook={this.state.book} loadSynopsis={true}/>;
    }

    var {values, searchedBooks} = this.state;
    var searchResults;

    if (searchedBooks && searchedBooks.length > 0) {
      searchResults = searchedBooks.map((book, index) => {
        return (
          <div key={index}>
            <div style={{display: 'flex'}}>
              <BookImage book={book} />
              <BookData book={book} showExtra={false} showTitle={true}>
                <button type="button" className="btn btn-default" onClick={() => this.chooseBook(book)}>Choose Book</button>
              </BookData>
            </div>
            <hr/>
          </div>
        )
      })
    }
    else if (this.state.searching) {
      searchResults = <div><h3>Searching <span className="fa fa-cog fa-spin"/></h3></div>
    }

    return (
      <div style={{width: '800px'}}>
      <h3>Lookup Book in GoodReads</h3>
        <FormTable onSubmit={this.searchBooks} allowEnter={true}>
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
          <FormFieldSubmit  btnType="submit" label="Search">
              <button type="button" onClick={this.chooseBook} className="btn btn-default">Manually Add Book</button>
          </FormFieldSubmit>
        </FormTable>
        <hr/>
        {searchResults}
      </div>
    )
  }
};

module.exports = LookupBook;
