import React from 'react';
import PropTypes from 'prop-types';

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
  propTypes: {
    to : PropTypes.string
  },
  render: function() {
    let isActive = false;
    // let isActive = this.history.isActive(this.props.to, this.props.query, this.props.onlyActiveOnIndex);
    let className = isActive ? 'active' : '';

    return (
      <li style={liStyle}>
        <a className={className} style={linkStyle} {...this.props}/>
      </li>
    )
  }
});

module.exports = {LinkTab, FillinTab};
