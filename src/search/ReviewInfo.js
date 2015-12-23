import React from 'react';
var PropTypes = React.PropTypes;
import ScaleBadge from './ScaleBadge';
import Scales from '../const/ScaleConst';
import sharedStyles from './Styles';

var styles = {
  tdLeft: {
    width:'10%',
    textAlign:'right',
    fontWeight: 'bold',
    paddingRight: '10px',
    verticalAlign: 'top',
  }
};

var printDate = function(date) {
  return date.toISOString()
  .replace(/^(\d+)-(\d+)-(\d+).*$/, // Only extract Y-M-D
      function (a,y,m,d) {
          return [
              d, // Day
              ['Jan','Feb','Mar','Apr','May','Jun',  // Month Names
              'Jul','Ago','Sep','Oct','Nov','Dec']
              [m-1], // Month
              y  // Year
          ].join('-') // Stitch together
      });
};

var ReviewRow = React.createClass({
  propTypes: {
    header: PropTypes.string.isRequired
  },
  render: function() {
    return (
      <tr>
        <td style={styles.tdLeft}>{this.props.header}:</td>
        <td> {this.props.children} </td>
      </tr>
  )
  }
})

var ReviewInfo = React.createClass({
  propTypes: {
    review: PropTypes.object.isRequired,
  },
  getInitialState: function() {
    return {
      expanded:false,
    };
  },
  toggleShow: function() {
    this.setState({expanded: !this.state.expanded});
  },
  render: function() {
    var review = this.props.review;

    if (this.state.expanded) {
      return (
        <div key={review.reviewId}>
          <a onClick={this.toggleShow} className="fa fa-caret-down">Hide</a>
          <div style={sharedStyles.box}>
            <table width="100%">
              <tbody>
                <ReviewRow header="Reviewed By">{review.reviewedBy}</ReviewRow>
                <ReviewRow header="Review Date">{printDate(new Date(review.reviewDate))}</ReviewRow>
                <ReviewRow header="Recommendation">
                    <ScaleBadge rateTypeKey="" rateType="Recommendation" expanded={true}rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
                </ReviewRow>
                <ReviewRow header="Sex">
                  <ScaleBadge rateTypeKey="" rateType="Sex" expanded={true} rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
                </ReviewRow>
                <ReviewRow header="Profanity">
                  <ScaleBadge rateTypeKey="" rateType="Profanity" expanded={true} rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
                </ReviewRow>
                <ReviewRow header="Violence">
                  <ScaleBadge rateTypeKey="" rateType="Violence" expanded={true} rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
                </ReviewRow>
                <ReviewRow header="Review">{review.reviewDescription}</ReviewRow>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
    else {
      return(
          <div key={review.reviewId}>
            <a onClick={this.toggleShow} className="fa fa-caret-right">Show</a>
            &nbsp;
            <ScaleBadge rateTypeKey="" rateType="Recommendation" rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
            &nbsp;
            <ScaleBadge rateTypeKey="Sex" rateType="Sex" rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
            &nbsp;
            <ScaleBadge rateTypeKey="Profanity" rateType="Profanity" rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
            &nbsp;
            <ScaleBadge rateTypeKey="Violence" rateType="Violence" rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
            &nbsp;
            {review.reviewedBy}
            {review.reviewDescription?<span className="fa fa-info-circle" style={{marginLeft:'10px', color:'#009933'}}/>:""}
          </div>
        );
      }
  }
});

module.exports = ReviewInfo;
