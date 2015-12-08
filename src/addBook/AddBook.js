import React from 'react';
import {AutoSuggestFormField, FormField, FormFieldInput} from '../util/FormField';
import { History} from 'react-router';
var PropTypes = React.PropTypes;
var alertify = require('alertify-webpack');

const authors = ['Sanderson, Brandon', 'Smith, Johsnon', 'Sankers, Jack', 'Dodge, Kevin'];
const titles = ['Title 1', 'Title 2', 'Title 3'];
const series = ['Series 1', 'Series 2', 'Series 3'];
const genres = ['Fantasy', 'Fiction', 'Sci Fi'];
const locations = ['Dons Kindle', 'Dons Audible', 'Library', 'Keiths Audible'];

function getTitleSuggestions(id, input, callback) {
  getSuggestions(id, titles, input, callback);
}

function getSeriesSuggestions(id, input, callback) {
  getSuggestions(id, series, input, callback);
}

function getAuthorSuggestions(id, input, callback) {
  getSuggestions(id, authors, input, callback);
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

  setTimeout(() => {
    if (document.activeElement && document.activeElement.id == id) {
      callback(null, suggestions)
    }
  }, 500); // Emulate API call
}

function stopEnterSubmitting(e) {
    if (e.charCode == 13) {
        var src = e.srcElement || e.target;
        if (src.tagName.toLowerCase() != "textarea" && (!src.type || src.type != "submit")) {
            if (e.preventDefault) {
                e.preventDefault();
            }
        }
    }
}

function showAlways() {
  return true;
}

const INITIAL_STATE = {
    values: {
      title:"",
      seriesTitle:"",
      seriesBookNumber:"",
      imageUrl:"",
      author:"",
      genre:"",
      bookLocation:"",
      showError: false,
      required: {
        title: showAlways,
        seriesTitle: function(values) {
          return values.seriesBookNumber != ""
        },
        seriesBookNumber: function(values) {
          return values.seriesTitle != ""
        },
        author: showAlways,
        genre: showAlways,
      }
    },
}

var AddReviewMain = React.createClass({
  mixins: [History],
  propTypes: {
    addBook: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      ...INITIAL_STATE
    };
  },
  addBook: function() {
    console.log("Add Book");
    var {values} = this.state;

    var isValid = true;
    Object.keys(values.required).map((key) => {
      if (!this.isValid(key)) {
        isValid = false;
      }
    });

    if (isValid) {
      var book = {
        title: values.title,
        seriesTitle: values.seriesTitle,
        seriesBookNumber: values.seriesBookNumber,
        imageUrl: values.imageUrl,
        author: values.author,
        genre: values.genre,
        locationOfBook: values.bookLocation,
      };

      var bookId = this.props.addBook(book);
      this.setState(INITIAL_STATE);
      alertify.log.success("HURRAY Book added!!!");
      this.history.pushState(null, "/review/" + bookId + "/new");
    }
    else {
      this.setState({values:{...values, showError: !isValid}});
      alertify.log.error("Your form is not filled out.");
    }
  },
  isValid: function(id) {
      var {values} = this.state;
      if (values.required[id] && values.required[id](values) && values[id] == "") {
        return false;
      }
      return true;
  },
  onChange: function(prop, valid) {
    var data = {values:{...this.state.values}};
    data.values[prop.target.id] = prop.target.value;
    // data.formValid[prop.target.id] = valid;
    this.setState(data);
  },
  onChangeWithValue: function(id, value, valid) {
    var data = {values:{...this.state.values}};
    data.values[id] = value;
    // data.formValid[id] = valid;
    this.setState(data);
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
        <h2>Book Review</h2>
        <form className="form-horizontal" onSubmit={this.addBook} onKeyPress={stopEnterSubmitting}>
          <AutoSuggestFormField
            label="Title" id="title"
            suggestions={getTitleSuggestions}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Series" id="seriesTitle"
            suggestions={getSeriesSuggestions}
            data={values}
            onChange={this.onChangeWithValue}
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
            inputType="text"
            label="Image Url" id="imageUrl"
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />
          {imageUrl}

          <AutoSuggestFormField
            label="Author" id="author"
            suggestions={getAuthorSuggestions}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Genre" id="genre"
            suggestions={getGenreSuggestions}
            showWhen={showAlways}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Location of Book" id="bookLocation"
            suggestions={getLocationOfBookSuggestions}
            showWhen={showAlways}
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
