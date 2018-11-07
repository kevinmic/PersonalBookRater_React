import React from 'react';
import PropTypes from 'prop-types';

class ManualBadge extends React.Component{
  static propTypes = {
    labelType: PropTypes.any,
    description: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string
  }

  render() {
    var tooltip = '';
    if (this.props.label && this.props.description) {
      tooltip = this.props.label + " Rating: " + this.props.value + " - " + this.props.description;
    }
    else if (this.props.description) {
        tooltip = this.props.description;
    }
    return (
      <span
        className={"label label-as-badge " + this.props.labelType}
        data-toggle="tooltip"
        data-placement="bottom"
        title={tooltip}
        style={{marginRight:1}}
        >
          {this.props.label?this.props.label+ " : ":""}{this.props.value}
        </span>
    )
  }
};

export default ManualBadge;
