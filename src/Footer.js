import React from 'react';
var PropTypes = React.PropTypes;

var Footer = React.createClass({
  render: function() {
    return (
      <div style={{textAlign: 'right', height:'100px'}}>
        <hr width="100%"/>
        <a href="https://github.com/kevinmic/PersonalBookRater_React">www.github.com</a>
      </div>
    )
  }
});

module.exports = Footer;
