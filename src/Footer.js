import React from 'react';

const footerStyle = {
  textAlign: 'right',
  height:'50px',
  display:'flex',
  flexDirection:'row-reverse',
  alignItems:'center',
}

class Footer extends React.Component{
  render() {
    return (
      <div className="hfColor" style={footerStyle}>
        <a style={{color: '#FFFFFF', paddingRight:'20px'}} target="_new" href="https://github.com/kevinmic/PersonalBookRater_React/issues">Issues: www.github.com</a>
      </div>
    )
  }
};

export default Footer;
