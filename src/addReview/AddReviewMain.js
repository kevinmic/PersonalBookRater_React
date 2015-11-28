import React from 'react';
import Scales from '../const/ScaleConst';
var PropTypes = React.PropTypes;

const helpers = {
  ratingToOption: function(ratingList) {
    return ratingList.map((rating) => {
      const {key, description} = rating;
      return <option key={key}>{key + ' - ' + description}</option>;
    });
  }
}

var RatingOptions = React.createClass({
  propTypes: {
    rateList: React.PropTypes.arrayOf(Scales.SCALE_PROPTYPE).isRequired,
    id : React.PropTypes.string.isRequired,
    label : React.PropTypes.string.isRequired
  },
  render: function() {
    return (
        <div className="form-group">
          <label htmlFor={this.props.id}>{this.props.label}:</label>
          <br />
          <select id={this.props.id}>
            <option>Please Select</option>
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
            <label htmlFor="series">Series: </label>
            <input type="text" className="form-control" id="series"/>
          </div>
          <div className="form-group">
            <label htmlFor="bookNum">Book Number: </label>
            <input type="text" className="form-control" id="bookNum"/>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image Url: </label>
            <input type="text" className="form-control" id="imageUrl"/>
          </div>
          <div className="form-group">
            <label htmlFor="author">Author: </label>
            <input type="text" className="form-control" id="author"/>
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre: </label>
            <input type="text" className="form-control" id="genre"/>
          </div>
          <div className="form-group">
            <label htmlFor="bookLocation">Location of Book: </label>
            <input type="text" className="form-control" id="bookLocation"/>
          </div>
          <RatingOptions id="overallRating" label="Overall Rating" rateList={Scales.scaleMapToList(Scales.RATING_SCALE)}/>
          <RatingOptions id="profanityRating" label="Profanity Rating" rateList={Scales.scaleMapToList(Scales.PROFANITY_SCALE)}/>
          <RatingOptions id="sexualRating" label="Sexual Rating" rateList={Scales.scaleMapToList(Scales.SEXUAL_SCALE)}/>
          <RatingOptions id="violenceRating" label="Violence Rating" rateList={Scales.scaleMapToList(Scales.VIOLENCE_SCALE)}/>
          <div className="form-group">
            <label htmlFor="reviewDescription">Review: </label>
            <textarea className="form-control" rows="5" id="reviewDescrption"/>
          </div>

          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
});

module.exports = AddReviewMain;
