import React from 'react';
import { Link, IndexLink } from 'react-router';
import bookHeaderIMG from './images/BookHeader.jpg';
import logoIMG from './images/Logo.png';
var PropTypes = React.PropTypes;

import firebaseInfo from '../config/firebase-info.js';
import {LinkTab, FillinTab} from './util/Tab';

var LoginInfo = React.createClass({
  propTypes: {
    auth : React.PropTypes.object
  },
  unAuth: function() {
    new Firebase(firebaseInfo.firebaseurl).unauth();
    alertify.success("You are now logged out!");
  },
  render: function() {
    var {auth} = this.props;
    if (auth.loggedIn) {
      return (
        <FillinTab>
          {auth.username}&nbsp;
          <a onClick={this.unAuth} style={{color: '#344c2d', textDecoration: 'underline'}}>Sign Out</a>
        </FillinTab>
      );
    }
    else {
      return (<LinkTab to="login">Login</LinkTab>);
    }
  }
})

var NavBar = React.createClass({
  propTypes: {
    auth : React.PropTypes.object
  },
  render: function() {
    var addUser;
    if (this.props.auth.loggedIn) {
        addUser =[
            <LinkTab key="addUser" to="/user/new">ADD USER</LinkTab>,
            <FillinTab key="filler">|</FillinTab>,
            ]

    }
    return (
      <div style={{marginBottom:'20px'}}>
        <div className="hfColor" style={{height:'15px'}}/>
        <div style={{display:'flex', alignItems:'center', flexDirection: 'row', justifyContent: 'space-between', marginRight:'20px', marginLeft:'20px'}}>
          <image src={logoIMG} />
          <ul id="mainnav" style={{marginTop: '0px', marginBottom:'0px'}}>
            <LinkTab to="/">LIBRARY</LinkTab>
            <FillinTab>|</FillinTab>
            <LinkTab to="/book/new">ADD BOOK</LinkTab>
            <FillinTab>|</FillinTab>
            {addUser}
            <LoginInfo auth={this.props.auth} />
          </ul>
        </div>
        <div>
          <image src={bookHeaderIMG} width="100%"/>
        </div>
        <hr style={{marginTop:'10px'}}/>
      </div>
    );
  }

});

module.exports = NavBar;
