import React from 'react';
import { Link, IndexLink } from 'react-router';
var PropTypes = React.PropTypes;
import Tab from './util/Tab';

          // <ul className="nav nav-tabs">
          //   <Tab href="/">Search</Tab>
          //   <Tab href="/addreview">Add Review</Tab>
          // </ul>
var NavBar = React.createClass({
  render: function() {
    return (
      <div>
          <h1>NAV BAR</h1>
          <ul className="nav nav-tabs">
            <Tab to="/" onlyActiveOnIndex={true}>Search</Tab>
            <Tab to="/review/new">Add Review</Tab>
          </ul>
      </div>
    );
  }

});

module.exports = NavBar;
