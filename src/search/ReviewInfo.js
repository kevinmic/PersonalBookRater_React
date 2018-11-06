import React from 'react';
import PropTypes from 'prop-types';
import ScaleBadge from '../util/ScaleBadge';
import {SearchByReviewer} from '../util/GoToHelper';
import Scales from '../const/ScaleConst';
import sharedStyles from './Styles';
import marked from 'marked';

marked.setOptions({breaks: true});

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

class ReviewRow extends React.Component{
  static propTypes = {
    header: PropTypes.string.isRequired
  }

  render() {
    return (
      <tr>
        <td style={styles.tdLeft}>{this.props.header}:</td>
        <td> {this.props.children} </td>
      </tr>
  )
  }
};

class ReviewInfo extends React.Component{
  static propTypes = {
    review: PropTypes.object.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      expanded:false,
    };
  }

  toggleShow = () => {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    var review = this.props.review;

    if (this.state.expanded) {
      return (
        <div key={review.reviewId}>
          <a onClick={this.toggleShow} ><span className="fa fa-caret-down"/> Hide</a>
          <div style={sharedStyles.box}>
            <table width="100%">
              <tbody>
                <ReviewRow header="Reviewed By"><a onClick={() => SearchByReviewer(review.reviewId)}>{review.reviewedBy}</a></ReviewRow>
                <ReviewRow header="Review Date">{printDate(new Date(review.reviewDate))}</ReviewRow>
                {review.ageAppropriate?<ReviewRow header="Minimum Age">{Scales.AGE_SCALE[review.ageAppropriate].description}</ReviewRow>:null}
                <ReviewRow header="Recommendation">
                  <span className="miniBadge">
                    <ScaleBadge rateTypeKey="" rateType="Recommendation" expanded={true} rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
                  </span>
                </ReviewRow>
                <ReviewRow header="Sex">
                  <span className="miniBadge">
                    <ScaleBadge rateTypeKey="" rateType="Sex" expanded={true} rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
                  </span>
                </ReviewRow>
                <ReviewRow header="Profanity">
                  <span className="miniBadge">
                    <ScaleBadge rateTypeKey="" rateType="Profanity" expanded={true} rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
                  </span>
                </ReviewRow>
                <ReviewRow header="Violence">
                  <span className="miniBadge">
                    <ScaleBadge rateTypeKey="" rateType="Violence" expanded={true} rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
                  </span>
                </ReviewRow>
                <ReviewRow header="Review">
                  <span dangerouslySetInnerHTML={{__html:marked(review.reviewDescription)}}/>
                </ReviewRow>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
    else {
      return(
          <div key={review.reviewId}>
            <a onClick={this.toggleShow} ><span className="fa fa-caret-right"/> Show</a>
            &nbsp;
            <span className="miniBadge">
              <ScaleBadge rateTypeKey="" rateType="Recommendation" rateList={Scales.RATING_SCALE} rateKey={review.recommendRating}/>
            </span>
            &nbsp;
            <span className="miniBadge">
              <ScaleBadge rateTypeKey="Sex" rateType="Sex" rateList={Scales.SEXUAL_SCALE} rateKey={review.sexRating}/>
            </span>
            &nbsp;
            <span className="miniBadge">
              <ScaleBadge rateTypeKey="Profanity" rateType="Profanity" rateList={Scales.PROFANITY_SCALE} rateKey={review.profanityRating}/>
            </span>
            &nbsp;
            <span className="miniBadge">
              <ScaleBadge rateTypeKey="Violence" rateType="Violence" rateList={Scales.VIOLENCE_SCALE} rateKey={review.violenceRating}/>
            </span>
            &nbsp;
            <a onClick={() => SearchByReviewer(review.reviewId)}>{review.reviewedBy}</a>
            {review.reviewDescription?<span className="fa fa-file-text-o green" title="Has Text Review" style={{marginLeft:'10px'}}/>:""}
          </div>
        );
      }
  }
};

module.exports = ReviewInfo;
