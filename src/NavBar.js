import React from 'react';
import bookHeaderIMG from './images/BookHeader.jpg';
import logoIMG from './images/Logo.png';
var PropTypes = React.PropTypes;

import firebaseInfo from '../config/firebase-info.js';

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
        <span >
          <span style={{fontSize:'13px'}}>{auth.username}&nbsp;</span>
          <a onClick={this.unAuth} style={{color: '#344c2d', textDecoration: 'underline'}}>Sign Out</a>
        </span>
      );
    }
    else {
      return (<a href="#/login">Login</a>);
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
        addUser = <li><a href="#/user/new">ADD USER</a></li>
    }
    if (_.get(this.props.auth, 'roles.books') || _.get(this.props.auth, 'roles.editbooks')) {
        addBook = <li><a href="#/book/new">ADD BOOK</a></li>
    }

    var seperator= <li>|</li>;

    return (
      <div>
        <div className="hfColor" style={{height:'15px'}}/>
        <div style={{display:'flex', alignItems:'center', flexDirection: 'row', justifyContent: 'space-between', marginRight:'20px', marginLeft:'20px'}}>
          <a href="#/search">
            <image src={logoIMG} />
          </a>
          <ul className="navlinks" id="mainnav" style={{marginTop: '0px', marginBottom:'0px'}}>
            <li><a href="#/search">LIBRARY</a></li>
            {seperator}
            {addBook}
            {addBook?seperator:null}
            {addUser}
            {addUser?seperator:null}
            <li>
              <LoginInfo auth={this.props.auth} />
            </li>
          </ul>
        </div>
        {this.props.showBooksBar?<div><image src={bookHeaderIMG} width="100%"/></div>:''}
        {this.props.showBooksBar?<hr style={{marginTop:'10px'}}/>:''}
      </div>
    );
  }

});

module.exports = NavBar;
