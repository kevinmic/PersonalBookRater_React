import React from 'react';
var PropTypes = React.PropTypes;

const RATING_SCALE = [
  {key:"1",  description:"I didnt like it, didnt finish it, and don't recommend it "},
  {key:"2",  description:"I finished this book but didn't like it"},
  {key:"3",  description:"I enjoyed it but not enough to to seek out other books by this author"},
  {key:"4",  description:"It was OK, I might read another book in this series"},
  {key:"5",  description:"I struggled to get caught up in the book but finally enjoyed it"},
  {key:"6",  description:"I liked it but i was uncomfortable with some objectional elements (sex, language, graphic violence)"},
  {key:"7",  description:"Conditional recommendation: I liked it enough to recommend it, but It has objectional content."},
  {key:"8",  description:"Good Book"},
  {key:"9",  description:"Full recommendation even though it has some objectional elements"},
  {key:"10", description:"Full recommendation"}
];

const PROFANITY_SCALE = [
  {key:"A", description:"No Profanity"},
  {key:"B", description:"Ligh use of mild profanity"},
  {key:"C", description:"Limited use of hard profanity"},
  {key:"D", description:"One or more characters in the book tend to use hard profanity"},
  {key:"P", description:"Profane, frequent and uncomfortable use of hard core profanity  "}
];

const SEXUAL_SCALE = [
  {key:"G", description:"No offensive Sexual Content"},
  {key:"T", description:"Sexual Tension or Sex Implied"},
  {key:"PG", description:"Some undeswcribed Sexual Encounters"},
  {key:"R", description:"Sexual Encounters described in detail with intent to tittilate"},
];

const VIOLENCE_SCALE = [
  {key:"NV", description:"No or Little Violence"},
  {key:"LV", description:"Some violent incidents not well described"},
  {key:"FV", description:"Frequent violentincidents"},
  {key:"VB", description:"Violent, bloody, or shocking, well described mayhem"},
];

const helpers = {
  ratingToOption: function(ratingList) {
    return ratingList.map((rating) => {
      const {key, description} = rating;
      return <option key={key}>{key + '-' + description}</option>;
    });
  }
}

var RatingOptions = React.createClass({
  propTypes: {
    rateList: React.PropTypes.array,
    id : React.PropTypes.string,
    label : React.PropTypes.string
  },
  render: function() {
    return (
        <div className="form-group">
          <label htmlFor={this.props.id}>{this.props.label}:</label>
          <br />
          <select id={this.props.id}>
            {helpers.ratingToOption(this.props.rateList)}
          </select>
        </div>
    );
  }

});

module.exports = RatingOptions;

var AddReviewMain = React.createClass({
  render: function() {
    return (
      <div>
        <form role="form">
          <div className="form-group">
            <label htmlFor="title">Title: </label>
            <input type="text" className="form-control" id="title"/>
          </div>
          <div className="form-group">
            <label htmlFor="author">Author: </label>
            <input type="text" className="form-control" id="author"/>
          </div>
          <RatingOptions id="overallRating" label="Overall Rating" rateList={RATING_SCALE}/>
          <RatingOptions id="profanityRating" label="Profanity Rating" rateList={PROFANITY_SCALE}/>
          <RatingOptions id="sexualRating" label="Sexual Rating" rateList={SEXUAL_SCALE}/>
          <RatingOptions id="violenceRating" label="Violence Rating" rateList={VIOLENCE_SCALE}/>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
});

module.exports = AddReviewMain;
