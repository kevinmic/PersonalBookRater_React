import React, { Component } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import firebaseInfo from '../config/firebase-info.js';
import SearchMain from './search/SearchMain';
import Login from './Login';
import AddUser from './addUser/AddUser';
import ChangeUserPassword from './addUser/ChangeUserPassword';
import EditBook from './addBook/EditBook';
import LookupBook from './addBook/LookupBook';
import AddReviewMain from './addReview/AddReviewMain';

alertify.logPosition("bottom right");

var App = React.createClass({
  getInitialState: function() {
    return {
      users : {},
      books : {},
      reviews : {},
      auth: {},
      location: '',
      hashdata: [],
      prevSearch: {},
      loadingBooks: true,
      loadingReviews: true,
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
          books: dataSnapshot.val(),
          loadingBooks: false,
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
          reviews: dataSnapshot.val(),
          loadingReviews: false,
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

    window.addEventListener('hashchange', this.navigated, false);
    this.navigated();
  },
  componentWillUnMount: function() {
    this.fbRef.off();
  },
  navigated: function() {
    var hash = window.location.hash;
    var split = hash.split('/');

    var location = 'search';
    var data = [];
    if (split && split.length > 1 && split[0] == '#') {
      location = split[1];
      if (split.length > 2) {
        data = split.slice(2, split.length);
      }
    }
    this.setState({location: location, hashdata: data})
  },
  renderChildren: function () {

    return React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, {
        books: booksPlusReviews,
        users: this.state.users,
        auth: this.state.auth,
      });
    }.bind(this))
  },
  setPrevSearch: function(search) {
    this.setState({prevSearch: search});
  },
  render() {
    var booksPlusReviews = _.mapValues(this.state.books, (book) => {
      var reviews = {};
      if (this.state.reviews && this.state.reviews[book.bookId]) {
        reviews = this.state.reviews[book.bookId].reviews;
      }
      book = _.merge({}, book, {reviews: reviews});
      return book;
    });

    let loginActive = false;

    var body;
    var showLocation;
    switch (this.state.location) {
      case 'login':
        body = <Login auth={this.state.auth}/>
        loginActive = true;
      break;
      case 'user':
        if (this.state.hashdata[0] == 'new') {
          body = <AddUser auth={this.state.auth}/>
        }
        else {
          body = <div>USER EDIT NOT IMPLEMENTED</div>
        }
      break;
      case 'changepassword':
        body = <ChangeUserPassword auth={this.state.auth}/>
      break;
      case 'review':
        var bookId = this.state.hashdata[0];
        body = <AddReviewMain users={this.state.users} books={booksPlusReviews} auth={this.state.auth} bookId={bookId}/>
        break;
      case 'book':
        if (this.state.hashdata[0] == 'new') {
          body = <LookupBook users={this.state.users} books={booksPlusReviews} auth={this.state.auth}/>
        }
        else {
          body = <EditBook users={this.state.users} books={booksPlusReviews} auth={this.state.auth} bookId={this.state.hashdata[0]} />
        }
      break;
      case 'search':
      default:
        showLocation = 'search';
        body = <SearchMain users={this.state.users} books={booksPlusReviews} auth={this.state.auth} storeSearch={this.setPrevSearch} prevSearch={this.state.prevSearch} loadingBooks={this.state.loadingBooks} loadingReviews={this.state.loadingReviews}/>
      break;
    }

    // Login has its own styling, so we will render children directly
    var wrapChildrenStyle = !loginActive?{margin:'20px 20px 20px 20px'}:{};

    return (
      <div style={{minWidth: '1000px'}}>
        <NavBar auth={this.state.auth} setAuthData={this.setAuthData} showBooksBar={!loginActive} showLocation={showLocation}/>
        <div style={wrapChildrenStyle}>
          {body}
        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = App;
