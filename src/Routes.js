import React from 'react';
import { Router, Route, Link, IndexRoute, History} from 'react-router';
var PropTypes = React.PropTypes;

import App from './App';
import SearchMain from './search/SearchMain';
import AddReviewMain from './addReview/AddReviewMain';
import LookupBook from './addBook/LookupBook';
import Login from './Login';
import AddUser from './addUser/AddUser.js';
import EditBook from './addBook/EditBook.js';

var Routes = React.createClass({
  render: function() {
    return (
      <Router createElement={this.createElement}>
        <Route path="/" component={App}>
          <IndexRoute component={SearchMain}/>
          <Route path="review/search" component={SearchMain}/>
          <Route path="review/:bookId/new" component={AddReviewMain}/>
          <Route path="book/new" component={LookupBook}/>
          <Route path="book/:bookId/edit" component={EditBook}/>
          <Route path="user/new" component={AddUser}/>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
    );
  }
});

module.exports = Routes;
