import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import Scales from '../const/ScaleConst';
import ScaleBadge from './ScaleBadge';
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';

var BookReview = React.createClass({
  render: function() {
    var book = this.props.book;

    if (book.reviews && book.reviews.length > 0) {
      var review = book.reviews[0];
    }
    else {
      review = {};
    }

    return (
        <div className="row">
          <BookImage book={book}/>
          <div className="col-sm-10">
            <h3>
              {book.title}&nbsp;
              <ScaleBadge rateTypeKey="" rateType="Recommendation" rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
            </h3>
            <div className="row">
                <Link to={"review/" + book.bookId + "/new"}>Add Review</Link>
            </div>
            <ScaleBadge rateTypeKey="s" rateType="Sex" rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
            <ScaleBadge rateTypeKey="p" rateType="Profanity" rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
            <ScaleBadge rateTypeKey="v" rateType="Violence" rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
            <BookData book={book}/>
            <div className="row">
              <div className="col-sm-12">{review.review}</div>
            </div>
          </div>
        </div>
    );
  }

});

module.exports = BookReview;
