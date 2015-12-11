import React from 'react';
import { Router, Route, Link, IndexRoute, History} from 'react-router';
var PropTypes = React.PropTypes;

import App from './App';
import SearchMain from './search/SearchMain';
import AddReviewMain from './addReview/AddReviewMain';
import AddBook from './addBook/AddBook';
import Login from './Login';

var Routes = React.createClass({
  render: function() {
    return (
      <Router createElement={this.createElement}>
        <Route path="/" component={App}>
          <IndexRoute component={SearchMain}/>
          <Route path="review/search" component={SearchMain}/>
          <Route path="review/:bookId/new" component={AddReviewMain}/>
          <Route path="book/new" component={AddBook}/>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
    );
  }
});

module.exports = Routes;
