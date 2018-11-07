import React from 'react';
import PropTypes from 'prop-types';
import ManualBadge from './ManualBadge';

class ScaleBadge extends React.Component {
  static propTypes = {
    rateList: PropTypes.object.isRequired,
    rateKey: PropTypes.string,
    rateTypeKey: PropTypes.string,
    expanded: PropTypes.bool,
    nowrap: PropTypes.bool,
  }

  render() {
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
        <div style={this.props.style}>
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
};

export default ScaleBadge;
