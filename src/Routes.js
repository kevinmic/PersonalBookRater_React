import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

import App from './App';
import SearchMain from './SearchMain';
import AddReviewMain from './addReview/AddReviewMain';
import ViewReview from './ViewReview';

var Routes = React.createClass({

  render: function() {
    return (
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={SearchMain}/>
          <Route path="review/search" component={SearchMain}/>
          <Route path="review/new" component={AddReviewMain}/>
          <Route path="review/view/:reviewId" component={ViewReview}/>
        </Route>
      </Router>
    );
  }
});

module.exports = Routes;
