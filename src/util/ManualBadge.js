import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;

var ManualBadge = React.createClass({
  propTypes: {
    labelType: React.PropTypes.any,
    description: React.PropTypes.string,
    label: React.PropTypes.string,
    value: React.PropTypes.string
  },
  render: function() {
    return (
      <span
        className={"label label-as-badge " + this.props.labelType}
        data-toggle="tooltip"
        data-placement="bottom"
        title={this.props.label + " Rating: " + this.props.description}
        style={{marginRight:1}}
        >
          {this.props.label?this.props.label+ " : ":""}{this.props.value}
        </span>
    )
  }
});

module.exports = ManualBadge;
