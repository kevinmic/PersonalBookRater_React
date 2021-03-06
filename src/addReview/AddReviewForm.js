import React from 'react';
import PropTypes from 'prop-types';
import alertify from 'alertifyjs';
import _ from 'lodash';
import firebase from 'firebase/app';
import 'firebase/database';

import Scales from '../const/ScaleConst';
import {FormField, FormTable, FormFieldSubmit} from '../util/FormFieldTable';
import FormValidationMixins from '../util/FormValidationMixins';
import RatingOptions from '../util/RatingOptions';

class RatingOptionsWFormField extends React.Component{
  static propTypes = {
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    data : PropTypes.object.isRequired,
    onChange: PropTypes.func,
    isValid: PropTypes.func,
    rateList: PropTypes.object.isRequired,
  }

  render() {
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
};

const getDefaultReview = () => ({
  recommendRating:"",
  profanityRating:"",
  sexRating:"",
  violenceRating:"",
  reviewDescription:"",
  ageAppropriate:"",
});

class AddReviewForm extends React.Component{
  static propTypes = {
    auth: PropTypes.object,
    book: PropTypes.object,
    callback: PropTypes.func,
    style: PropTypes.object,
  }

  constructor(props) {
    super(props);

    var {reviews} = this.props.book;
    var {userid} = this.props.auth;
    var values = getDefaultReview();
    if (reviews && reviews[userid]) {
      values = reviews[userid];
    }

    this.state = {
      values,
      showError: false,
      required: {
        recommendRating: () => true,
      },
    };

    FormValidationMixins.addAndBind(this);
  }

  addReview = () => {
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
  }

  render() {
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
};

export default AddReviewForm;
