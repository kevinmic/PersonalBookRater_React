import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import Scales from '../const/ScaleConst';
import ScaleBadge from './ScaleBadge';
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';
import _ from 'lodash';

var BookReview = React.createClass({
  propTypes: {
    book: React.PropTypes.object.isRequired,
    bookId: React.PropTypes.string.isRequired,
  },
  render: function() {
    var {book, bookId} = this.props;

    if (book.reviews) {
      var review = _.values(book.reviews)[0];
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
                <Link to={"review/" + bookId + "/new"}>Add Review</Link>
            </div>
            <ScaleBadge rateTypeKey="s" rateType="Sex" rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
            <ScaleBadge rateTypeKey="p" rateType="Profanity" rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
            <ScaleBadge rateTypeKey="v" rateType="Violence" rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
            <BookData book={book}/>
            <div className="row">
              <div className="col-sm-12">{review.reviewDescription}</div>
            </div>
          </div>
        </div>
    );
  }

});

module.exports = BookReview;
