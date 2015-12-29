import React, { Component } from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar';
import Footer from './Footer';
import firebaseInfo from '../config/firebase-info.js';

alertify.logPosition("bottom right");

var App = React.createClass({
  getInitialState: function() {
    return {
      books : {},
      reviews : {},
      auth: {},
    };
  },
  loadReviewsFromFirebase: function(dataSnapshot) {
      var bookId = dataSnapshot.key();
      var newReviews = dataSnapshot.val();
      if (!this.state.reviews || !this.state.reviews[bookId] || !_.isEqual(this.state.reviews[bookId], newReviews)) {
        // console.log("add book")
        var reviews = {...this.state.reviews};

        reviews[bookId] = newReviews;
        this.setState({
          reviews: reviews
        });
      }
      else {
        // console.log("ignore book")
      }
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
    this.fbRef = new Firebase(firebaseInfo.firebaseurl + "/");
    var fbBooks = this.fbRef.child("books");
    fbBooks.once("value", (dataSnapshot) => {
        this.setState({
          books: dataSnapshot.val()
        });
        fbBooks.on("child_added", this.loadBookFromFirebase);
    });
    fbBooks.on("child_changed", this.loadBookFromFirebase);
    fbBooks.onAuth((val, val2) => {
      if (val) {
        var email = val.password.email;
        var userid = val.uid;
        this.setState({auth: {loggedIn: true, username: email, userid: userid}});

        this.fbRef.child("users").child(userid).once("value", (data) => {
          var user = data.val();
          var roles = {reviews: false, books: false, users: false};
          if (user.roles) {
            _.merge(roles, user.roles);
          }
          this.setState({auth: {loggedIn: true, username: email, userid: userid, name: user.name, roles: roles}});
        });
      }
      else {
        this.setState({auth: {}});
      }
    });

    var fbReviews = this.fbRef.child("bookReviews");
    fbReviews.once("value", (dataSnapshot) => {
        this.setState({
          reviews: dataSnapshot.val()
        });
        fbReviews.on("child_added", this.loadReviewsFromFirebase);
    });
    fbReviews.on("child_changed", this.loadReviewsFromFirebase);

    var fbUsers = this.fbRef.child("users");
    fbUsers.once("value", (dataSnapshot) => {
        this.setState({
          users: dataSnapshot.val()
        });
    });
  },
  componentWillUnMount: function() {
    this.fbRef.off();
  },
  renderChildren: function () {
    var booksPlusReviews = _.mapValues(this.state.books, (book) => {
      var reviews = {};
      if (this.state.reviews && this.state.reviews[book.bookId]) {
        reviews = this.state.reviews[book.bookId].reviews;
      }
      book = _.merge({}, book, {reviews: reviews});
      return book;
    });

    return React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, {
        books: booksPlusReviews,
        users: this.state.users,
        auth: this.state.auth,
      });
    }.bind(this))
  },
  render() {
    return (
      <div style={{minWidth: '1000px'}}>
        <NavBar auth={this.state.auth} setAuthData={this.setAuthData} />
        <div style={{margin:'20px 20px 20px 20px'}}>
          {this.renderChildren()}
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = App;
