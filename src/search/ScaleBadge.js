import React from 'react';
import { Link } from 'react-router';
import ManualBadge from './ManualBadge';
var PropTypes = React.PropTypes;

var ScaleBadge = React.createClass({
  propTypes: {
    rateList: React.PropTypes.object.isRequired,
    rateKey: React.PropTypes.string,
    rateType: React.PropTypes.string,
    rateTypeKey: React.PropTypes.string,
    expanded: React.PropTypes.bool,
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

    if (this.props.expanded) {
      if (rate.key == "?") { // Override the description if unknown
        rate.description = "";
      }
      return (
        <div>
          <div style={{float:'left', textAlign:'right', width: '15%'}}>
            <b>{this.props.rateTypeKey} :&nbsp;</b>
          </div>
          <ManualBadge
              labelType={rate.labelType}
              value={rate.key}/>
          &nbsp;
          {rate.description}
        </div>
      );

    }
    else {
      return (
        <ManualBadge
          labelType={rate.labelType}
          description={rate.description}
          label={this.props.rateTypeKey}
          value={rate.key}/>
      );
    }
  }
});

module.exports = ScaleBadge;
