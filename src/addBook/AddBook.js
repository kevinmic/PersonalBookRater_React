import React from 'react';
import _ from 'lodash';
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from '../util/FormField';
import FormValidationMixins from '../util/FormValidationMixins';
import { History} from 'react-router';
var PropTypes = React.PropTypes;
var alertify = require('alertify-webpack');

const titles = ['Title 1', 'Title 2', 'Title 3'];
const series = ['Series 1', 'Series 2', 'Series 3'];
const genres = ['Fantasy', 'Fiction', 'Sci Fi'];
const locations = ['Dons Kindle', 'Dons Audible', 'Library', 'Keiths Audible'];

function getTitleSuggestions(id, input, callback) {
  getSuggestions(id, titles, input, callback);
}

function getGenreSuggestions(id, input, callback) {
  getSuggestions(id, genres, input, callback);
}

function getLocationOfBookSuggestions(id, input, callback) {
  getSuggestions(id, locations, input, callback);
}

function getSuggestions(id, list, input, callback) {
  const regex = new RegExp('^' + input, 'i');
  const suggestions = list.filter(suburb => regex.test(suburb));
  callback(null, suggestions)
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
      imageUrl = <div>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">
            <img className="img-responsive" src={values.imageUrl} />
          </div>
        </div>
        <div className="row">
          &nbsp;
        </div>
      </div>
    }

    return (
      <div>
        <h2>Add Book</h2>
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <AutoSuggestFormField
            label="Title" id="title"
            suggestions={getTitleSuggestions}
            data={values}
            onChange={this.onChangeWithValue}
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
