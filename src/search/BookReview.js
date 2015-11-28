import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import Scales from '../const/ScaleConst';

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

var ScaleBadge = React.createClass({
  propTypes: {
    rateList: React.PropTypes.object.isRequired,
    rateKey: React.PropTypes.string,
    rateType: React.PropTypes.string,
    rateTypeKey: React.PropTypes.string
  },
  render: function() {
    const rateKey = this.props.rateKey;
    const rateList = this.props.rateList;
    var rate = {
      labelType: "label-default",
      key: "?",
      description: "Unknown Type",
    };

    if (rateKey && rateList[rateKey]) {
      rate = rateList[rateKey];
    }

    return (
      <span
        className={"label label-as-badge " + rate.labelType}
        data-toggle="tooltip"
        data-placement="bottom"
        title={this.props.rateType + " Rating: " + rate.description}
        style={{marginRight:1}}
        >
          {this.props.rateTypeKey?this.props.rateTypeKey + ":":""}{rate.key}
        </span>
    )
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
    return (
        <div className="row">
          <div className="col-sm-2">
            <img className="img-responsive" src={book.imageUrl} />
          </div>
          <div className="col-sm-10">
            <h3>
              {book.title}&nbsp;
              <ScaleBadge rateTypeKey="" rateType="Recommendation" rateList={Scales.RATING_SCALE} rateKey={book.recommendRating}/>
            </h3>
            <ScaleBadge rateTypeKey="s" rateType="Sex" rateList={Scales.SEXUAL_SCALE} rateKey={book.sexRating}/>
            <ScaleBadge rateTypeKey="p" rateType="Profanity" rateList={Scales.PROFANITY_SCALE} rateKey={book.profanityRating}/>
            <ScaleBadge rateTypeKey="v" rateType="Violence" rateList={Scales.VIOLENCE_SCALE} rateKey={book.violenceRating}/>
            <div className="row">
              <div className="col-sm-8">
                <InnerRow label="Author" value={book.author}/>
                {series}
                {seriesBookNumber}
                <InnerRow label="Location" value={book.locationOfBook}/>
                <div className="row">
                  <div className="col-sm-12">{book.review}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

});

module.exports = BookReview;
