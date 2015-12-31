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
    auth : React.PropTypes.object,
    showBooksBar: React.PropTypes.bool,
  },
  render: function() {
    var addUser;
    var addBook;
    if (_.get(this.props.auth, 'roles.users')) {
        addUser = <LinkTab key="addUser" to="/user/new">ADD USER</LinkTab>;
    }
    if (_.get(this.props.auth, 'roles.books') || _.get(this.props.auth, 'roles.editbooks')) {
        addBook = <LinkTab to="/book/new">ADD BOOK</LinkTab>;
    }

    return (
      <div>
        <div className="hfColor" style={{height:'15px'}}/>
        <div style={{display:'flex', alignItems:'center', flexDirection: 'row', justifyContent: 'space-between', marginRight:'20px', marginLeft:'20px'}}>
          <Link to="/">
            <image src={logoIMG} />
          </Link>
          <ul id="mainnav" style={{marginTop: '0px', marginBottom:'0px'}}>
            <LinkTab to="/">LIBRARY</LinkTab>
            <FillinTab>|</FillinTab>
            {addBook}
            {addBook?<FillinTab>|</FillinTab>:null}
            {addUser}
            {addUser?<FillinTab>|</FillinTab>:null}
            <LoginInfo auth={this.props.auth} />
          </ul>
        </div>
        {this.props.showBooksBar?<div><image src={bookHeaderIMG} width="100%"/></div>:''}
        {this.props.showBooksBar?<hr style={{marginTop:'10px'}}/>:''}
      </div>
    );
  }

});

module.exports = NavBar;
