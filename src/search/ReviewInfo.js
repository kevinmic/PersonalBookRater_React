import React from 'react';
var PropTypes = React.PropTypes;
import ScaleBadge from './ScaleBadge';
import Scales from '../const/ScaleConst';

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
          <div style={{marginLeft: '20px'}}>
            <div>
              <div style={{float:'left', textAlign:'right', width: '15%'}}>
                <b>Reviewed By:&nbsp;</b>
              </div>
              {review.reviewedBy}
            </div>
            <div>
              <div style={{float:'left', textAlign:'right', width: '15%'}}>
                <b>Review Date:&nbsp;</b>
              </div>
              {printDate(new Date(review.reviewDate))}
            </div>
            <div>
              <ScaleBadge rateTypeKey="Recommendation" rateType="Recommendation" expanded={true}rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
            </div>
            <div>
              <ScaleBadge rateTypeKey="Sex" rateType="Sex" expanded={true} rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
            </div>
            <div>
              <ScaleBadge rateTypeKey="Profanity" rateType="Profanity" expanded={true} rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
            </div>
            <div>
              <ScaleBadge rateTypeKey="Violence" rateType="Violence" expanded={true} rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
            </div>
            <div>
              <div style={{float:'left', textAlign:'right', width: '15%'}}>
                <b>Review:&nbsp;</b>
              </div>
              {review.reviewDescription}&nbsp;
            </div>
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
          </div>
        );
      }
  }
});

module.exports = ReviewInfo;
