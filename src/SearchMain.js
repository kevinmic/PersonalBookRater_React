import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;

var Search = React.createClass({
  render: function() {
    return (
      <div>
        Search Main<br/>
        <Link to="/addreview">Add Review</Link>
      </div>
    );
  }
});

module.exports = Search;
