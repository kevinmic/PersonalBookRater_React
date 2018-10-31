import React from 'react';
var PropTypes = React.PropTypes;

import Scales from '../const/ScaleConst';
import {AutoSuggestFormField, FormField, FormTable, FormFieldSubmit, FormFieldInput, stopEnterSubmitting} from '../util/FormFieldTable';
import FormValidationMixins from '../util/FormValidationMixins';
import RatingOptions from '../util/RatingOptions';
import TableStyles from '../styles/TableStyles';

var RatingOptionsWFormField = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    data : React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
    isValid: React.PropTypes.func,
    rateList: React.PropTypes.object.isRequired,
  },

  render: function() {
    return (
      <FormField
        label={this.props.label} id={this.props.id}
        data={this.props.data}
        isValid={this.props.isValid}
        >
        <RatingOptions
          rateList={this.props.rateList}
          value={this.props.data[this.props.id]}
          onChange={(value) => this.props.onChange(this.props.id, value)}
          />
      </FormField>
    )
  }
});

const getDefaultReview = () => ({
  recommendRating:"",
  profanityRating:"",
  sexRating:"",
  violenceRating:"",
  reviewDescription:"",
  ageAppropriate:"",
});

var AddReviewForm = React.createClass({
  mixins: [FormValidationMixins],
  propTypes: {
    auth: React.PropTypes.object,
    book: React.PropTypes.object,
    callback: React.PropTypes.func,
    style: React.PropTypes.object,
  },
  getInitialState: function() {
    var {reviews} = this.props.book;
    var {userid} = this.props.auth;
    var values = getDefaultReview();
    if (reviews && reviews[userid]) {
      values = reviews[userid];
    }

    return {
      values,
      showError: false,
      required: {
        recommendRating: () => true,
      },
    };
  },
  addReview: function() {
    var isValid = this.validateAllRequiredFields();

    if (isValid) {
      var review = _.pick(this.state.values, 'reviewDate', 'recommendRating', 'profanityRating', 'sexRating', 'violenceRating', 'reviewDescription', 'ageAppropriate');

      var firebaseRef = firebase.database().ref('/bookReviews');

      if (this.props.auth.name) {
        review.reviewedBy = this.props.auth.name;
      }
      else {
        review.reviewedBy = this.props.auth.username;
      }

      if (!review.reviewDate) {
        review.reviewDate = new Date().getTime();
      }

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
            <RatingOptionsWFormField
              label="Overall Rating"id="recommendRating"
              rateList={Scales.RATING_SCALE}
              data={values}
              onChange={this.onChangeWithValue}
              isValid={this.isValid}
              />

            <RatingOptionsWFormField
              label="Profanity Rating" id="profanityRating"
              rateList={Scales.PROFANITY_SCALE}
              data={values}
              onChange={this.onChangeWithValue}
              isValid={this.isValid}
              />

            <RatingOptionsWFormField
               label="Sexual Rating" id="sexRating"
               rateList={Scales.SEXUAL_SCALE}
               data={values}
               onChange={this.onChangeWithValue}
               isValid={this.isValid}
               />

            <RatingOptionsWFormField
              label="Violence Rating" id="violenceRating"
              rateList={Scales.VIOLENCE_SCALE}
              data={values}
              onChange={this.onChangeWithValue}
              isValid={this.isValid}
              />

            <RatingOptionsWFormField
              label="Minimum Age" id="ageAppropriate"
              rateList={Scales.AGE_SCALE}
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
