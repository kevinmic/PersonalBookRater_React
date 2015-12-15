import React from 'react';
import _ from 'lodash';
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from '../util/FormField';
import FormValidationMixins from '../util/FormValidationMixins';
import { History} from 'react-router';
var PropTypes = React.PropTypes;
var alertify = require('alertify-webpack');
import BookImage from '../book/BookImage';
import Login from '../Login';
import firebaseInfo from '../../config/firebase-info.js';

var AddBook = React.createClass({
  mixins: [History, FormValidationMixins],
  propTypes: {
    books: React.PropTypes.object,
    initBook: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      search: {
        books: {},
        manual: false,
      },
      values: {
        title:"",
        seriesTitle:"",
        seriesBookNumber:"",
        imageUrl:"",
        author:"",
        genre:"",
        locationOfBook:"",
        showError: false,
      },
      showError: false,
      required: {
        title: () => true,
        seriesTitle: function(values) {
          return values.seriesBookNumber != ""
        },
        seriesBookNumber: function(values) {
          return values.seriesTitle != ""
        },
        author: () => true,
        genre: () => true,
      },
      previousGenres: [],
      previousLocations: [],
    };
  },
  componentDidMount: function() {
    const book = this.props.initBook;
    if (book) {
      this.setState({values: book});
    }
  },
  addBook: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var {values} = this.state;
      var book = _.pick(this.state.values, 'title', 'seriesTitle', 'seriesBookNumber', 'imageUrl', 'author', 'genre', 'locationOfBook');

      var firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/books");
      book.reviews = {};

      var bookRef = firebaseRef.push();
      book.bookId = bookRef.key();
      bookRef.set(book, (error) => {
        if (error) {
          alertify.log.error("Book " + book.title + " was not saved! Reason: " + error);
        }
        else {
          alertify.log.success("Book " + book.title + " added!");
          this.history.pushState(null, "/review/" + book.bookId + "/new");
        }
      });

    }
    else {
      this.setState({showError: true});
      alertify.log.error("Please fill out missing required fields.");
    }
  },
  componentWillMount: function() {
    var firebase = new Firebase(firebaseInfo.firebaseurl);
    firebase.child("genres").on("value", (ref => {
      this.setState({previousGenres: _.values(ref.val())})
    }));
    firebase.child("bookLocations").on("value", (ref => {
      this.setState({previousLocations: _.values(ref.val())})
    }));
  },
  render: function() {
    var values = this.state.values;

    var imageUrl = "";
    if (values.imageUrl) {
      imageUrl = (<div>
          <BookImage book={values}/>
          <div className="row">
            &nbsp;
          </div>
        </div>
      )
    }

    if (values.title && this.props.books) {
      var matchingBooks = _.values(this.props.books).filter((book) => values.title == book.title);
      if (matchingBooks.length > 0) {
        var titleDuplicate = (<div style={{color: "red"}}>A book with this title already exists</div>)
      }
    }

    return (
      <div>
        <h2>Add Book</h2>
        <a onClick={this.goodreadsSearch}>Search</a>
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <FormFieldInput
            label="Title" id="title"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          {titleDuplicate}

          <FormFieldInput
            label="Series" id="seriesTitle"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <FormFieldInput
            inputType="number"
            label="Book Number" id="seriesBookNumber"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <FormFieldInput
            inputType="url"
            label="Image Url" id="imageUrl"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          {imageUrl}

          <FormFieldInput
            label="Author" id="author"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Genre" id="genre"
            suggestions={() => this.state.previousGenres}
            showWhen={() => true}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Location of Book" id="locationOfBook"
            suggestions={() => this.state.previousLocations}
            showWhen={() => true}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="button" onClick={this.addBook} className="btn btn-default">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = AddBook;
