import React from 'react';
import { Link } from 'react-router';
import ManualBadge from './ManualBadge';
var PropTypes = React.PropTypes;

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
      <ManualBadge
        labelType={rate.labelType}
        description={rate.description}
        label={this.props.rateTypeKey}
        value={rate.key}/>
    )
  }
});

module.exports = ScaleBadge;
