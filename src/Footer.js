import React from 'react';
var PropTypes = React.PropTypes;

var Footer = React.createClass({
  render: function() {
    return (
      <div className="hfColor" style={{textAlign: 'right', height:'50px'}}>
        <hr width="100%"/>
        <a style={{color: '#FFFFFF'}} href="https://github.com/kevinmic/PersonalBookRater_React">www.github.com</a>
      </div>
    )
  }
});

module.exports = Footer;
