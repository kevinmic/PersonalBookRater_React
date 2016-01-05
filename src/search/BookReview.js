import React from 'react';
var PropTypes = React.PropTypes;
import Scales from '../const/ScaleConst';
import ManualBadge from '../util/ManualBadge';
import BookData from '../book/BookData';
import BookImage from '../book/BookImage';
import AddReviewForm from '../addReview/AddReviewForm';
import ReviewInfo from './ReviewInfo';
import sharedStyles from './Styles';
import LocationConst from '../const/LocationConst';

var showHeaderIcons = function(book) {
  var headerIcons = [];
  if (book.locationOfBook) {
    return LocationConst.filter((loc) => book.locationOfBook.indexOf(loc.value) >= 0)
        .map((loc) => loc.type) // change to type
        .filter((loc) => loc) // filter out blanks
        .map((type) => {
          if (type == 'kindle') {
            return <span key={type} style={{fontSize: '20px', paddingLeft:'2px', paddingRight:'5px'}} title="Kindle" className="fa fa-book"/>
          }
          if (type == 'audible') {
            return <span key={type}  style={{fontSize: '20px', paddingLeft:'2px', paddingRight:'5px'}} title="Audible" className="fa fa-headphones"/>
          }
          return null;
        });
  }
}

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
      value = book.overallRating.toString();
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
    var editBookUI;
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

    if (_.get(this.props.auth, 'roles.reviews')) {
      addReviewUI = (
          <div>
            <div>
              <span className={getArrowClass(this.state.addReviewDirect)}>
                {this.props.auth && this.props.auth.loggedIn?<a onClick={this.toggleAddReviewExpanded} >{book.reviews[this.props.auth.userid]?"Edit":"Add"} Review</a>:""}
              </span>
            </div>
            {this.state.addReviewDirect?<AddReviewForm style={_.merge({width:'500px', backgroundColor: '#f0f2f5'},sharedStyles.box)} book={book} auth={this.props.auth} callback={this.toggleAddReviewExpanded}/>:null}
          </div>
      );
    }
    if (_.get(this.props.auth, 'roles.editbooks')) {
      editBookUI = (
        <div>
          <a href={"#/book/" + bookId + "/edit"}>Edit Book</a>
        </div>
      );

    }

    return (
      // Unfortunately I have to override bootstrap here
      <table style={{borderCollapse: 'inherit'}}>
        <tbody>
        <tr>
          <td style={{verticalAlign:'top'}}><BookImage book={book}/></td>
          <td style={{verticalAlign:'top'}} width="100%">
            <div style={{fontSize:'25px', fontWeight: 'bold'}}>
              {book.title}&nbsp;
              {showHeaderIcons(book)}
              {combinedRatingUI}
            </div>
            {reviewsUI}
            <span className={getArrowClass(this.state.expanded)}>
              <a onClick={this.toggleExpanded} >Book Info</a>
            </span>
            {expandedBookUI}
            {addReviewUI}
            {editBookUI}
          </td>
        </tr>
        </tbody>
      </table>
    );
  }

});

module.exports = BookReview;
