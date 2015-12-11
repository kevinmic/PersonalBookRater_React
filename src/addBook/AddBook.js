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
    addBook: React.PropTypes.func,
    books: React.PropTypes.object,
    auth: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
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
    if (!this.props.auth.loggedIn) {
      return <Login redirect={false} message="You must login in order to add a book."/>;
    }

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

    return (
      <div>
        <h2>Add Book</h2>
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <FormFieldInput
            label="Title" id="title"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

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
