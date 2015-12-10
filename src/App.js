import React, { Component } from 'react';
import { Link } from 'react-router';
import NavBar from './NavBar';
import firebaseInfo from '../config/firebase-info.js';

var App = React.createClass({
  getInitialState: function() {
    return {
      books : {}
    };
  },
  addBook: function(book) {
    book.reviews = {};
    var bookRef = this.firebaseRef.push(book);
    return bookRef.key();
  },
  addReview: function(bookId, review, callback) {
    review.reviewedBy = "Don Dodge";
    review.reviewDate = new Date().getTime();
    this.firebaseRef.child(bookId).child("reviews").push(review);
  },
  loadBookFromFirebase: function(dataSnapshot) {
      var books = {...this.state.books};
      books[dataSnapshot.key()] = dataSnapshot.val();
      this.setState({
        books: books
      });
  },
  componentWillMount: function() {
    this.firebaseRef = new Firebase(firebaseInfo.firebaseurl + "/books");

    this.firebaseRef.on("child_added", this.loadBookFromFirebase);
    this.firebaseRef.on("child_changed", this.loadBookFromFirebase);
  },
  componentWillUnMount: function() {
    this.firebaseRef.off();
  },
  renderChildren: function () {
    return React.Children.map(this.props.children, function (child) {
      return React.cloneElement(child, {
        books: this.state.books,
        addBook: this.addBook,
        addReview: this.addReview
      });
    }.bind(this))
  },
  render() {

    return (
      <div>
        <NavBar/>
        {this.renderChildren()}
      </div>
    );
  }
});

module.exports = App;
