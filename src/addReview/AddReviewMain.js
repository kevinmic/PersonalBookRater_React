import React from 'react';
import _ from 'lodash';
import Scales from '../const/ScaleConst';
import {AutoSuggestFormField, FormField, FormFieldInput, stopEnterSubmitting} from '../util/FormField';
import FormValidationMixins from '../util/FormValidationMixins';
import { History} from 'react-router';
import RatingOptions from '../util/RatingOptions';
var PropTypes = React.PropTypes;
var alertify = require('alertify-webpack');
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';

const INITIAL_STATE = {
    values: {
      recommendRating:"",
      profanityRating:"",
      sexRating:"",
      violenceRating:"",
      reviewDescription:"",
    },
    showError: false,
    required: {
      recommendRating: () => true,
    }
}

var AddReviewMain = React.createClass({
  mixins: [History, FormValidationMixins],
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
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var review = _.pick(this.state.values,'recommendRating', 'profanityRating', 'sexRating', 'violenceRating', 'reviewDescription');

      this.props.addReview(this.state.book.bookId, review);
      this.setState(INITIAL_STATE);
      alertify.log.success("Review Added for book " + this.state.book.title + "!!!");
      this.history.pushState(null, "/review/search");
    }
    else {
      this.setState({showError: !isValid});
      alertify.log.error("Please fill out required fields.");
    }
  },
  componentDidMount: function() {
    const bookId = this.props.params.bookId
    this.setState({ book: this.props.books[bookId]});
  },
  render: function() {
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
