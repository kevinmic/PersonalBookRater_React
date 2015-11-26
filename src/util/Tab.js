import React from 'react';
import { Link, IndexLink, History } from 'react-router';
var PropTypes = React.PropTypes;

var    Tab = React.createClass({
  mixins: [ History ],
  render: function() {
    let isActive = this.history.isActive(this.props.to, this.props.query, this.props.onlyActiveOnIndex);
    let className = isActive ? 'active' : '';

    return (
      <li className={className}><Link {...this.props}/></li>
    )
  }
});

module.exports = Tab;
