import React, { Component } from 'react';
import PubSub from 'pubsub-js';
import NavBar from './NavBar';
import Footer from './Footer';
import firebaseInit from './FireBaseInit';
import SearchMain from './search/SearchMain';
import Login from './Login';
import AddUser from './addUser/AddUser';
import ChangeUserPassword from './addUser/ChangeUserPassword';
import EditBook from './addBook/EditBook';
import LookupBook from './addBook/LookupBook';
import AddReviewMain from './addReview/AddReviewMain';

alertify.logPosition("bottom right");

var fixReview = function(review) {
  if (review.violenceRating== 'FV') {
    review.violenceRating = 'MV';
  }
};

var App = React.createClass({
  getInitialState: function() {
    return {
      users : {},
      books : {},
      reviews : {},
      auth: {},
      location: '',
      hashdata: [],
      lastSearchId: '',
      searchId: '',
      searchHistory: {},
      loadingBooks: true,
      loadingReviews: true,
    };
  },
  loadReviewsFromFirebase: function(dataSnapshot) {
      var bookId = dataSnapshot.key;
      var newReviews = dataSnapshot.val();
      if (!this.state.reviews || !this.state.reviews[bookId] || !_.isEqual(this.state.reviews[bookId], newReviews)) {
        console.log("add review", bookId, newReviews);
        var reviews = {...this.state.reviews};

        reviews[bookId] = newReviews;
        this.setState({
          reviews: reviews
        });
      }
      else {
        console.log("ignore review")
      }
  },
  loadBookFromFirebase: function(dataSnapshot) {
    
      var bookId = dataSnapshot.key;
      var newBook = dataSnapshot.val();
      if (!this.state.books[bookId] || !_.isEqual(this.state.books[bookId], newBook)) {
        console.log("add book")
        var books = {...this.state.books};

        books[bookId] = newBook;
        this.setState({
          books: books
        });
      }
      else {
        console.log("ignore book")
      }
  },
  componentWillMount: function() {
    this.fbRef = firebase.database();
    var fbBooks = this.fbRef.ref("/books");
    fbBooks.once('value').then((dataSnapshot) => {
        const books = dataSnapshot.val();
        this.setState({
           books,
           loadingBooks: false,
        });
        var keys = Object.keys(books||{});
        console.log("One Time load of books complete", keys.length)
        fbBooks.on("child_added", this.loadBookFromFirebase);
    });
    
    fbBooks.on("child_changed", this.loadBookFromFirebase);
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("USER LOGIN", user);
        var email = user.email;
        var userid = user.uid;
        this.setState({auth: {loggedIn: true, username: email, userid: userid}});

        this.fbRef.ref(`/users/${userid}`).once('value').then(data => {
          console.log("RELOAD USER", data);
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

    var fbReviews = this.fbRef.ref("/bookReviews");
    fbReviews.once('value').then(dataSnapshot => {
        var reviewsByBook = dataSnapshot.val();
        this.setState({
          reviews: reviewsByBook,
          loadingReviews: false,
        });
        var keys = Object.keys(reviewsByBook||{});
        console.log("One Time load of reviews complete", keys.length)
        fbReviews.on("child_added", this.loadReviewsFromFirebase);
    });
    fbReviews.on("child_changed", this.loadReviewsFromFirebase);
    

    var fbUsers = this.fbRef.ref("/users");
    fbUsers.once("value").then(dataSnapshot => {
      const users = dataSnapshot.val()
      this.setState({
        users
      });
        console.log("One Time load of users complete", Object.keys(users).length)
    });

    window.addEventListener('hashchange', this.navigated, false);
    this.navigated();
  },
  componentWillUnMount: function() {
    this.fbRef.off();
    PubSub.unsubscribe('prevsearch', this.gotoLastSearch);
    PubSub.unsubscribe('newsearch', this.createNewSearch);
  },
  componentDidMount: function() {
    PubSub.subscribe('prevsearch', this.gotoLastSearch);
    PubSub.subscribe('newsearch', this.createNewSearch);
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

    if (location == 'search' && data) {
      this.setState({searchId: data[0], lastSearchId: data[0]})
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
    var searchHistory = this.state.searchHistory;
    searchHistory[this.state.searchId] = search;
    this.setState({searchHistory: searchHistory});
  },
  gotoLastSearch: function() {
    window.location.hash = '#/search/' + this.state.lastSearchId;
  },
  createNewSearch: function(eventtype, search) {
    if (!search) {
      console.log("No Search Received for NewSearch Event");
      return;
    }
    var prevSearch = this.state.searchHistory[this.state.searchId];

    if (!search.filterOptions) {
      search.filterOptions = {};
    }
    if (!search.filterOptions.sort) {
      search.filterOptions.sort = _.clone(prevSearch.filterOptions.sort);
    }

    var searchId = new Date().getTime();
    var searchHistory = this.state.searchHistory;
    searchHistory[searchId] = search;
    this.setState({searchHistory: searchHistory});
    window.location.hash = '#/search/' + searchId;
  },
  render() {
    var booksPlusReviews = _.mapValues(this.state.books, (book) => {
      var reviews = {};
      if (this.state.reviews && this.state.reviews[book.bookId]) {
        reviews = _.cloneDeep(this.state.reviews[book.bookId].reviews);
        _.forIn(reviews, fixReview);
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
        if (!this.state.searchId) {
          var searchId = new Date().getTime();
          window.location.hash = '#/search/' + searchId;
          return <div/>;
        }
        showLocation = 'search';
        body = <SearchMain users={this.state.users} books={booksPlusReviews} auth={this.state.auth} storeSearch={this.setPrevSearch} prevSearch={this.state.searchHistory[this.state.searchId]} searchId={this.state.searchId} loadingBooks={this.state.loadingBooks} loadingReviews={this.state.loadingReviews}/>
      break;
    }

    // Login has its own styling, so we will render children directly
    var wrapChildrenStyle = !loginActive?{margin:'20px 20px 20px 20px'}:{};

    return (
      <div style={{minWidth: '1000px'}}>
        <NavBar auth={this.state.auth} setAuthData={this.setAuthData} showBooksBar={!loginActive} showLocation={showLocation}/>
        <div style={wrapChildrenStyle}>
-          {body}
-        </div>
        <Footer/>
      </div>
    );
  }
});

module.exports = App;
