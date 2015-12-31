import React from 'react';
var PropTypes = React.PropTypes;

const footerStyle = {
  textAlign: 'right',
  height:'50px',
  display:'flex',
  flexDirection:'row-reverse',
  alignItems:'center',
}

var Footer = React.createClass({
  render: function() {
    return (
      <div className="hfColor" style={footerStyle}>
        <a style={{color: '#FFFFFF', paddingRight:'20px'}} target="_new" href="https://github.com/kevinmic/PersonalBookRater_React/issues">Issues: www.github.com</a>
      </div>
    )
  }
});

module.exports = Footer;
