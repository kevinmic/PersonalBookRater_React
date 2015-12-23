import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import Scales from '../const/ScaleConst';
import ManualBadge from './ManualBadge';
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';
import AddReviewForm from '../addReview/AddReviewForm';
import ReviewInfo from './ReviewInfo';
import sharedStyles from './Styles';

var lookupRatingData = function(overallRating) {
   return _.values(Scales.RATING_SCALE).filter((rate) => {
     var rateValue = parseInt(rate.key);
     return rateValue <= overallRating && rateValue + 1 > overallRating;
   })[0];
};

var loadCombinedRating = function(book) {
    var labelType = "label-default";
    var value = "NR";
    if (book.overallRating) {
      value = book.overallRating;
      labelType = lookupRatingData(book.overallRating, Scales.RATING_SCALE).labelType;
    }

    return (<ManualBadge
              labelType={labelType}
              description=""
              value={value}
              />
            );
}

var getArrowClass = function(checkIt) {
  return checkIt?"fa fa-caret-down":"fa fa-caret-right";
}

var loadReviews = function(reviews) {
    return reviews.map((review) => <ReviewInfo key={review.reviewedBy} review={review}/> );
}

var BookReview = React.createClass({
  propTypes: {
    book: React.PropTypes.object.isRequired,
    bookId: React.PropTypes.string.isRequired,
    auth: React.PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      expanded:false,
      addReviewDirect:false,
    };
  },
  toggleExpanded: function() {
    this.setState({expanded: !this.state.expanded});
  },
  toggleAddReviewExpanded: function() {
    this.setState({addReviewDirect: !this.state.addReviewDirect});
  },
  render: function() {
    var {book, bookId} = this.props;
    var reviews = _.values(book.reviews)
    var reviewsUI;
    var expandedBookUI;
    var addReviewUI;
    var combinedRatingUI = loadCombinedRating(book);

    if (reviews && reviews.length > 0) {
      reviewsUI = loadReviews(reviews);
    }

    if (this.state.expanded) {
      expandedBookUI = (
        <div style={sharedStyles.box}>
            <BookData showExtra={true} book={book}/>
        </div>
      )
    }

    if (this.state.addReviewDirect) {
      addReviewUI = (
        <AddReviewForm style={sharedStyles.box} book={book} auth={this.props.auth} callback={this.toggleAddReviewExpanded}/>
      );
    }

    return (
      // Unfortunately I have to override bootstrap here
      <table style={{borderCollapse: 'inherit'}}>
        <tbody>
        <tr>
          <td style={{verticalAlign:'top'}}><BookImage book={book}/></td>
          <td style={{verticalAlign:'top'}} width="100%">
            <h4>
              {book.title}&nbsp;
              {combinedRatingUI}
            </h4>
            {reviewsUI}
            <a onClick={this.toggleExpanded} className={getArrowClass(this.state.expanded)}>Book Info</a>
            {expandedBookUI}
            <div>
              {this.props.auth && this.props.auth.loggedIn?<a onClick={this.toggleAddReviewExpanded} className={getArrowClass(this.state.addReviewDirect)}>Add Review</a>:""}
            </div>
            {addReviewUI}
          </td>
        </tr>
        </tbody>
      </table>
    );
  }

});

module.exports = BookReview;
