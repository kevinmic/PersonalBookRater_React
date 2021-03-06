import React from 'react';
import PropTypes from 'prop-types';
import Scales from '../const/ScaleConst';
import RSelect from 'react-select';
import '../react-select.css';
import ScaleBadge from './ScaleBadge';

class RatingOptions extends React.Component {
  static propTypes = {
    rateList: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    colorize: PropTypes.bool,
    style: PropTypes.object,
  }

  optionRenderer = (value) => {
    if (this.props.colorize) {
      return <option key={value.value} value={value.value}>{value.label}</option>;
    }
    else {
      var rate = this.props.rateList[value.value];
        return <ScaleBadge style={this.props.style} rateList={this.props.rateList} rateKey={rate.key} expanded={true}/>;
    }
  }

  valueRenderer = (value) => {
    if (this.props.colorize) {
      return <div key={value.value} value={value.value}>{value.label}</div>;
    }
    else {
      var rate = this.props.rateList[value.value];
        return <ScaleBadge style={this.props.style} rateList={this.props.rateList} rateKey={rate.key} expanded={true}/>;
    }
  }

  render() {
    var {rateList, value} = this.props;

    var mappedValues = Scales.scaleMapToList(rateList).map((rate) => {return {value:rate.key, label:rate.key + " - " + rate.description}});
    return (
        <RSelect
          options={mappedValues}
          optionRenderer={this.optionRenderer}
          valueRenderer={this.valueRenderer}
          value={value}
          onChange={(value) => this.props.onChange(value?value.value:'')}
          />
    );
  }
};


export default RatingOptions;
