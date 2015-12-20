import React, { Component } from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar';
import firebaseInfo from '../config/firebase-info.js';

var App = React.createClass({
  getInitialState: function() {
    return {
      books : {},
      auth: {},
    };
  },
  loadBookFromFirebase: function(dataSnapshot) {
      var bookId = dataSnapshot.key();
      var newBook = dataSnapshot.val();
      if (!this.state.books[bookId] || !_.isEqual(this.state.books[bookId], newBook)) {
        // console.log("add book")
        var books = {...this.state.books};

        books[bookId] = newBook;
        this.setState({
          books: books
        });
      }
      else {
        // console.log("ignore book")
      }
  },
  componentWillMount: function() {
    this.firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/books");


    this.firebaseRef.once("value", (dataSnapshot) => {
        this.setState({
          books: dataSnapshot.val()
        });
        this.firebaseRef.on("child_added", this.loadBookFromFirebase);
    });
    this.firebaseRef.on("child_changed", this.loadBookFromFirebase);
    this.firebaseRef.onAuth((val, val2) => {
      if (val) {
        var email = val.password.email;
        var userid = val.uid;
        this.setState({auth: {loggedIn: true, username: email, userid: userid}});
      }
      else {
        this.setState({auth: {}});
      }
    });
  },
  componentWillUnMount: function() {
    this.firebaseRef.off();
  },
  renderChildren: function () {
    return React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, {
        books: this.state.books,
        auth: this.state.auth,
      });
    }.bind(this))
  },
  render() {
    return (
      <div>
        <NavBar auth={this.state.auth} setAuthData={this.setAuthData} />
        {this.renderChildren()}
      </div>
    );
  }
});

module.exports = App;
