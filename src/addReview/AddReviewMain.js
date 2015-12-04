import React from 'react';
import Scales from '../const/ScaleConst';
import {AutoSuggestFormField, FormField, FormFieldInput} from './FormField';
import RatingOptions from './RatingOptions';
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
      series:"",
      bookNum:"",
      imageUrl:"",
      author:"",
      genre:"",
      bookLocation:"",
      overallRating:"",
      profanityRating:"",
      sexualRating:"",
      violenceRating:"",
      reviewDescription:"",
      showError: false,
      required: {
        title: showAlways,
        series: function(values) {
          return values.bookNum != ""
        },
        bookNum: function(values) {
          return values.series != ""
        },
        author: showAlways,
        genre: showAlways,
        overallRating: showAlways
      }
    },
}

var AddReviewMain = React.createClass({
  propTypes: {
    addReview: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      ...INITIAL_STATE
    };
  },
  addReview: function() {
    console.log("Add Review");
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
        seriesTitle: values.series,
        seriesBookNumber: values.bookNum,
        imageUrl: values.imageUrl,
        author: values.author,
        genre: values.genre,
        locationOfBook: values.bookLocation,
      };

      var review = {
        recommendRating: values.overallRating,
        profanityRating: values.profanityRating,
        sexRating: values.sexualRating,
        violenceRating: values.violenceRating,
        review: values.reviewDescription,
      }

      this.props.addReview(book, review);
      this.setState(INITIAL_STATE);
      alertify.log.success("HURRAY!!!");
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
    var imageUrl = "";
    if (this.state.imageUrl) {
      imageUrl = <div>
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-2">
            <img className="img-responsive" src={this.state.imageUrl} />
          </div>
        </div>
        <div className="row">
          &nbsp;
        </div>
      </div>
    }

    var values = this.state.values;
    return (
      <div>
        <h2>Book Review</h2>
        <form className="form-horizontal" onSubmit={this.addReview} onKeyPress={stopEnterSubmitting}>
          <AutoSuggestFormField
            label="Title" id="title"
            suggestions={getTitleSuggestions}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <AutoSuggestFormField
            label="Series" id="series"
            suggestions={getSeriesSuggestions}
            data={values}
            onChange={this.onChangeWithValue}
            isValid={this.isValid}
            />

          <FormFieldInput
            inputType="number"
            label="Book Number" id="bookNum"
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

          <RatingOptions
            label="Overall Rating"id="overallRating"
            rateList={Scales.scaleMapToList(Scales.RATING_SCALE)}
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <RatingOptions
            label="Profanity Rating" id="profanityRating"
            rateList={Scales.scaleMapToList(Scales.PROFANITY_SCALE)}
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <RatingOptions
             label="Sexual Rating" id="sexualRating"
             rateList={Scales.scaleMapToList(Scales.SEXUAL_SCALE)}
             data={values}
             onChange={this.onChange}
             isValid={this.isValid}
             />

          <RatingOptions
            label="Violence Rating" id="violenceRating"
            rateList={Scales.scaleMapToList(Scales.VIOLENCE_SCALE)}
            data={values}
            onChange={this.onChange}
            isValid={this.isValid}
            />

          <FormField data={values} label="Review" id="reviewDescription" isValid={this.isValid}>
            <textarea
              className="form-control"
              value={values.reviewDescription}
              rows="5"
              id="reviewDescription"
              onChange={this.onChange}/>
          </FormField>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = AddReviewMain;
