import React from 'react';
import _ from 'lodash';
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from '../util/FormField';
import FormValidationMixins from '../util/FormValidationMixins';
import { History} from 'react-router';
var PropTypes = React.PropTypes;
var alertify = require('alertify-webpack');
import BookImage from '../book/BookImage';

const genres = ['Fantasy', 'Fiction', 'Sci Fi'];
const locations = ['Dons Kindle', 'Dons Audible', 'Library', 'Keiths Audible'];

function getGenreSuggestions(id, input, callback) {
  return genres;
}

function getLocationOfBookSuggestions(id, input, callback) {
  return locations;
}

const INITIAL_STATE = {
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
    }
}

var AddReviewMain = React.createClass({
  mixins: [History, FormValidationMixins],
  propTypes: {
    addBook: React.PropTypes.func.isRequired,
    books: React.PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      ...INITIAL_STATE
    };
  },
  addBook: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var {values} = this.state;
      var book = _.pick(this.state.values, 'title', 'seriesTitle', 'seriesBookNumber', 'imageUrl', 'author', 'genre', 'locationOfBook');

      var bookId = this.props.addBook(book);
      this.setState(INITIAL_STATE);
      alertify.log.success("Book " + book.title + " added!");
      this.history.pushState(null, "/review/" + bookId + "/new");
    }
    else {
      this.setState({showError: true});
      alertify.log.error("Please fill out missing required fields.");
    }
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
            suggestions={getGenreSuggestions}
            showWhen={() => true}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Location of Book" id="locationOfBook"
            suggestions={getLocationOfBookSuggestions}
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

module.exports = AddReviewMain;
