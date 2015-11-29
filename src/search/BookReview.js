import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import Scales from '../const/ScaleConst';
import ScaleBadge from './ScaleBadge';

var InnerRow = React.createClass({
  defaultProps: {
    label: "",
    value: ""
  },
  render: function() {
    return (
      <div className="row">
        <div className="col-sm-3"><b>{this.props.label}:</b></div>
        <div className="col-sm-9">{this.props.value}</div>
      </div>
    );
  }
});

var BookReview = React.createClass({
  render: function() {
    var book = this.props.book;
    if (book.seriesTitle) {
      var series = <InnerRow label="Series" value={book.seriesTitle}/>
    }
    if (book.seriesBookNumber) {
      var seriesBookNumber = <InnerRow label="Book Number" value={book.seriesBookNumber}/>
    }
    
    if (book.reviews && book.reviews.length > 0) {
      var review = book.reviews[0];
    }
    else {
      review = {};
    }

    return (
        <div className="row">
          <div className="col-sm-2">
            <img className="img-responsive" src={book.imageUrl} />
          </div>
          <div className="col-sm-10">
            <h3>
              {book.title}&nbsp;
              <ScaleBadge rateTypeKey="" rateType="Recommendation" rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
            </h3>
            <ScaleBadge rateTypeKey="s" rateType="Sex" rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
            <ScaleBadge rateTypeKey="p" rateType="Profanity" rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
            <ScaleBadge rateTypeKey="v" rateType="Violence" rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
            <div className="row">
              <div className="col-sm-8">
                <InnerRow label="Author" value={book.author}/>
                {series}
                {seriesBookNumber}
                <InnerRow label="Location" value={book.locationOfBook}/>
                <div className="row">
                  <div className="col-sm-12">{review.review}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

});

module.exports = BookReview;
