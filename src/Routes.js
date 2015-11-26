import React from 'react';
import { Router, Route, Link, IndexRoute } from 'react-router';

import App from './App';
import SearchMain from './SearchMain';
import AddReview from './AddReview';
import ViewReview from './ViewReview';

var Routes = React.createClass({

  render: function() {
    return (
      <Router>
        <Route path="/" component={App}>
          <IndexRoute component={SearchMain}/>
          <Route path="addreview" component={AddReview}/>
          <Route path="view/:reviewId" component={ViewReview}/>
        </Route>
      </Router>
    );
  }
});

module.exports = Routes;
