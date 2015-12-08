import React from 'react';
import Scales from '../const/ScaleConst';
import {FormField} from './FormField';
var PropTypes = React.PropTypes;

const helpers = {
  ratingToOption: function(ratingList) {
    return ratingList.map((rating) => {
      const {key, description} = rating;
      return <option key={key} value={key}>{key + ' - ' + description}</option>;
    });
  }
}

var RatingOptions = React.createClass({
  propTypes: {
    rateList: React.PropTypes.arrayOf(Scales.SCALE_PROPTYPE).isRequired,
    label: React.PropTypes.string.isRequired,
    id : React.PropTypes.string.isRequired,
    data : React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func,
    isValid: React.PropTypes.func,
  },
  render: function() {
    var {rateList, onChange, ...other} = this.props;
    var {label, id, data} = this.props;
    return (
        <FormField {...other} label={label} id={id}>
          <select id={id} value={data[id]} className="form-control" onChange={onChange}>
            <option value="">Please Select</option>
            {helpers.ratingToOption(rateList)}
          </select>
        </FormField>
    );
  }
});

module.exports = RatingOptions;
