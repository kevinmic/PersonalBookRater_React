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
    id : React.PropTypes.string.isRequired
  },
  render: function() {
    return (
          <select id={this.props.id}>
            <option>Please Select</option>
            {helpers.ratingToOption(this.props.rateList)}
          </select>
    );
  }
});

var FormField = React.createClass({
  propTypes: {
    label : React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.id} className="col-sm-2 control-label">{this.props.label}: </label>
        <div className="col-sm-10">
          {this.props.children}
        </div>
      </div>
    )
  }
});

module.exports = RatingOptions;

var AddReviewMain = React.createClass({
  render: function() {
    return (
      <div>
        <h2>Book Review</h2>
        <form className="form-horizontal">
          <FormField label="Title" id="title">
            <input type="text" className="form-control" id="title"/>
          </FormField>
          <FormField label="Series" id="series">
            <input type="text" className="form-control" id="series"/>
          </FormField>
          <FormField label="Book Number" id="bookNum">
            <input type="number" className="form-control" id="bookNum"/>
          </FormField>
          <FormField label="Image Url" id="imageUrl">
            <input type="text" className="form-control" id="imageUrl"/>
          </FormField>
          <FormField label="Author" id="author">
            <input type="text" className="form-control" id="author"/>
          </FormField>
          <FormField label="Genre" id="genre">
            <input type="text" className="form-control" id="genre"/>
          </FormField>
          <FormField label="Location of Book" id="bookLocation">
            <input type="text" className="form-control" id="bookLocation"/>
          </FormField>
          <FormField label="Overall Rating" id="overallRating">
            <RatingOptions id="overallRating" rateList={Scales.scaleMapToList(Scales.RATING_SCALE)}/>
          </FormField>
          <FormField label="Profanity Rating" id="profanityRating">
            <RatingOptions id="profanityRating" rateList={Scales.scaleMapToList(Scales.PROFANITY_SCALE)}/>
          </FormField>
          <FormField label="Sexual Rating" id="sexualRating">
            <RatingOptions id="sexualRating" rateList={Scales.scaleMapToList(Scales.SEXUAL_SCALE)}/>
          </FormField>
          <FormField label="Violence Rating" id="violenceRating">
            <RatingOptions id="violenceRating" rateList={Scales.scaleMapToList(Scales.VIOLENCE_SCALE)}/>
          </FormField>
          <FormField label="Review" id="reviewDescription">
            <textarea className="form-control" rows="5" id="reviewDescrption"/>
          </FormField>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = AddReviewMain;
