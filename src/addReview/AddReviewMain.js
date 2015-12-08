import React from 'react';
import Scales from '../const/ScaleConst';
import {AutoSuggestFormField, FormField, FormFieldInput} from '../util/FormField';
import { History} from 'react-router';
import RatingOptions from '../util/RatingOptions';
var PropTypes = React.PropTypes;
var alertify = require('alertify-webpack');
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';

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
      recommendRating:"",
      profanityRating:"",
      sexRating:"",
      violenceRating:"",
      reviewDescription:"",
      showError: false,
      required: {
        recommendRating: showAlways
      }
    },
}

var AddReviewMain = React.createClass({
  mixins: [History],
  propTypes: {
    books: React.PropTypes.object.isRequired,
    addReview: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      book: {},
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
      var review = {
        recommendRating: values.recommendRating,
        profanityRating: values.profanityRating,
        sexRating: values.sexRating,
        violenceRating: values.violenceRating,
        review: values.reviewDescription,
      }

      this.props.addReview(this.state.book.bookId, review);
      this.setState(INITIAL_STATE);
      alertify.log.success("HURRAY, Review Added!!!");
      this.history.pushState(null, "/review/search");
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
  componentDidMount: function() {
    console.log("DidMount2:", this.props);
    const bookId = this.props.params.bookId
    this.setState({ book: this.props.books[bookId]});
  },
  render: function() {
    console.log("Render:", this.props);
    var values = this.state.values;
    var book = this.state.book;
    return (
      <div>
        <BookImage book={book}/>
        <div className="col-sm-10">
          <h2>Book Review:</h2>
          <h3>{book.title}</h3>
          <BookData book={book}/>
          <hr/>
          <form className="form-horizontal" onSubmit={this.addReview} onKeyPress={stopEnterSubmitting}>
            <RatingOptions
              label="Overall Rating"id="recommendRating"
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
               label="Sexual Rating" id="sexRating"
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
                <button type="button" onClick={this.addReview} className="btn btn-default">Submit</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = AddReviewMain;
