import React from 'react';
import Scales from '../const/ScaleConst';
import {FormField} from './FormField';
import RSelect from 'react-select';
import '../react-select.css';
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

    var mappedValues = rateList.map((rate) => {return {value:rate.key, label:rate.key + " - " + rate.description}});
    return (
        <FormField {...other} label={label} id={id}>
          <RSelect
            options={mappedValues}
            value={data[this.props.id]}
            onChange={(value, value2) => { this.props.onChange(id, value.value); }}
            />
        </FormField>
    );
  }
});

module.exports = RatingOptions;
