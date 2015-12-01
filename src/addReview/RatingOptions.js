import React from 'react';
import Scales from '../const/ScaleConst';
import {FormField} from './FormField';
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
    label: React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func
  },
  render: function() {
    return (
        <FormField label={this.props.label} id={this.props.id}>
          <select id={this.props.id} onChange={this.props.onChange}>
            <option>Please Select</option>
            {helpers.ratingToOption(this.props.rateList)}
          </select>
        </FormField>
    );
  }
});

module.exports = RatingOptions;
