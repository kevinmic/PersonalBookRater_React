import React from 'react';
import { Link } from 'react-router';
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

module.exports = ScaleBadge;
