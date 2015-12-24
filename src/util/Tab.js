import React from 'react';
import { Link, IndexLink, History } from 'react-router';
var PropTypes = React.PropTypes;

const linkStyle = {
  fontSize: '20px',
};

const liStyle = {
  display: 'inline',
  padding: '4px',
};

var FillinTab = React.createClass({
  render: function() {
      return (
        <li style={liStyle}>
          {this.props.children}
        </li>
      );
  },
});

var LinkTab = React.createClass({
  mixins: [ History ],
  propTypes: {
    to : React.PropTypes.string
  },
  render: function() {
    let isActive = this.history.isActive(this.props.to, this.props.query, this.props.onlyActiveOnIndex);
    let className = isActive ? 'active' : '';

    return (
      <li style={liStyle}>
        <Link className={className} style={linkStyle} {...this.props}/>
      </li>
    )
  }
});

module.exports = {LinkTab, FillinTab};
