import React from 'react';
var PropTypes = React.PropTypes;

var ManualBadge = React.createClass({
  propTypes: {
    labelType: React.PropTypes.any,
    description: React.PropTypes.string,
    label: React.PropTypes.string,
    value: React.PropTypes.string
  },
  render: function() {
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
});

module.exports = ManualBadge;
