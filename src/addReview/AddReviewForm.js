import React from 'react';
var PropTypes = React.PropTypes;

import Scales from '../const/ScaleConst';
import {AutoSuggestFormField, FormField, FormTable, FormFieldSubmit, FormFieldInput, stopEnterSubmitting} from '../util/FormFieldTable';
import FormValidationMixins from '../util/FormValidationMixins';
import RatingOptions from '../util/RatingOptions';
import firebaseInfo from '../../config/firebase-info.js';
import TableStyles from '../styles/TableStyles';

var AddReviewForm = React.createClass({
  mixins: [FormValidationMixins],
  propTypes: {
    auth: React.PropTypes.object,
    book: React.PropTypes.object,
    callback: React.PropTypes.func,
    style: React.PropTypes.object,
  },
  getInitialState: function() {
    return {
      values: {
        recommendRating:"",
        profanityRating:"",
        sexRating:"",
        violenceRating:"",
        reviewDescription:"",
        ageAppropriate:"",
      },
      showError: false,
      required: {
        recommendRating: () => true,
      },
    };
  },
  addReview: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var review = _.pick(this.state.values,'recommendRating', 'profanityRating', 'sexRating', 'violenceRating', 'reviewDescription', 'ageAppropriate');

      var firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/books");

      if (this.props.auth.name) {
        review.reviewedBy = this.props.auth.name;
      }
      else {
        review.reviewedBy = this.props.auth.username;
      }
      review.reviewDate = new Date().getTime();

      review.reviewId = this.props.auth.userid;
      firebaseRef.child(this.props.book.bookId).child("reviews").child(this.props.auth.userid).set(review, (error) => {
        if (error) {
          alertify.error("Review was not saved!  Reason: " + error);
        }
        else {
          alertify.success("Review Added for book " + this.props.book.title + "!!!");
          if (this.props.callback) {
            this.props.callback(review);
          }
        }
      });

    }
    else {
      this.setState({showError: !isValid});
      alertify.error("Please fill out required fields.");
    }
  },
  componentDidMount: function() {
    var {reviews} = this.props.book;
    var {userid} = this.props.auth;
    if (reviews && reviews[userid]) {
      this.setState({values: reviews[userid]});
    }
  },
  render: function() {
    if (!this.props.auth.loggedIn) {
      return <div>Login Required</div>;
    }

    var values = this.state.values;
    var book = this.props.book;

    if (!book) {
      return (
        <div>
          This book does not exist.
        </div>
      )
    }

    return (
        <div style={this.props.style} >
          <FormTable onSubmit={this.addReview}>
            <RatingOptions
              label="Overall Rating"id="recommendRating"
              rateList={Scales.scaleMapToList(Scales.RATING_SCALE)}
              data={values}
              onChange={this.onChangeWithValue}
              isValid={this.isValid}
              />

            <RatingOptions
              label="Profanity Rating" id="profanityRating"
              rateList={Scales.scaleMapToList(Scales.PROFANITY_SCALE)}
              data={values}
              onChange={this.onChangeWithValue}
              isValid={this.isValid}
              />

            <RatingOptions
               label="Sexual Rating" id="sexRating"
               rateList={Scales.scaleMapToList(Scales.SEXUAL_SCALE)}
               data={values}
               onChange={this.onChangeWithValue}
               isValid={this.isValid}
               />

            <RatingOptions
              label="Violence Rating" id="violenceRating"
              rateList={Scales.scaleMapToList(Scales.VIOLENCE_SCALE)}
              data={values}
              onChange={this.onChangeWithValue}
              isValid={this.isValid}
              />

            <RatingOptions
              label="Minimum Age" id="ageAppropriate"
              rateList={Scales.scaleMapToList(Scales.AGE_SCALE)}
              data={values}
              onChange={this.onChangeWithValue}
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

            <FormFieldSubmit onClick={this.addReview} label="Submit" />
          </FormTable>
        </div>
    );
  }
});

module.exports = AddReviewForm;
