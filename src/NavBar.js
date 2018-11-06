import React from 'react';
import bookHeaderIMG from './images/BookHeader.jpg';
import logoIMG from './images/Logo.png';
import PropTypes from 'prop-types';

import {GoToLastSearch} from './util/GoToHelper';

class LoginInfo extends React.Component{
  static propTypes = {
    auth : PropTypes.object
  }

  unAuth = () => {
    firebase.auth().signOut();
    alertify.success("You are now logged out!");
  }

  render() {
    var {auth} = this.props;
    if (auth.loggedIn) {
      return (
        <span >
          <span style={{fontSize:'13px'}}><a href="#/changepassword">{auth.username}</a>&nbsp;</span>
          <a onClick={this.unAuth} style={{color: '#344c2d', textDecoration: 'underline'}}>Sign Out</a>
        </span>
      );
    }
    else {
      return (<a href="#/login">Login</a>);
    }
  }
}

class NavBar extends React.Component{
  static propTypes = {
    auth : PropTypes.object,
    showBooksBar: PropTypes.bool,
  }

  render() {
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
          <a onClick={GoToLastSearch}>
            <image src={logoIMG} />
          </a>
          <ul className="navlinks" id="mainnav" style={{marginTop: '0px', marginBottom:'0px'}}>
            <li><a onClick={GoToLastSearch}>LIBRARY</a></li>
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

};

module.exports = NavBar;
