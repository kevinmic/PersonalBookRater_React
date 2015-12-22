import React from 'react';
import { Link, IndexLink } from 'react-router';
var PropTypes = React.PropTypes;
import Tab from './util/Tab';
import firebaseInfo from '../config/firebase-info.js';
var alertify = require('alertify-webpack');

var LoginInfo = React.createClass({
  propTypes: {
    auth : React.PropTypes.object
  },
  unAuth: function() {
    new Firebase(firebaseInfo.firebaseurl).unauth();
    alertify.log.success("You are now logged out!");
  },
  render: function() {
    var {auth} = this.props;
    if (auth.loggedIn) {
      return (
        <div className="pull-right">
          {auth.username}&nbsp;
          <a onClick={this.unAuth}>Sign Out</a>
        </div>
      );
    }
    else {
      return (<div className="pull-right"><Link to="login">Login</Link></div>);
    }
  }
})

var NavBar = React.createClass({
  propTypes: {
    auth : React.PropTypes.object
  },
  render: function() {
    var addUser = "";
    if (this.props.auth.loggedIn) {
        addUser = (
          <ul id="rightnav" className="nav nav-tabs" style={{float:'right', borderBottom:'none'}}>
            <Tab to="/user/new">Add User</Tab>
          </ul>
        )
    }
    return (
      <div >
          <LoginInfo auth={this.props.auth} />
          <h1>NAV BAR</h1>
          {addUser}
          <ul id="mainnav" className="nav nav-tabs">
            <Tab to="/" onlyActiveOnIndex={true}>Search</Tab>
            <Tab to="/book/new">Add Book</Tab>
          </ul>
          <br/>
      </div>
    );
  }

});

module.exports = NavBar;
