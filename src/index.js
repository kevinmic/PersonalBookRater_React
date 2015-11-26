import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, IndexRoute } from 'react-router';
import App from './App';

var Search = React.createClass({
  render: function() {
    return (
      <div>
        Search<br/>
        <Link to="/addreview">Add Review</Link>
      </div>
    );
  }
});

var AddReview = React.createClass({
  render: function() {
    return (
      <div>Add Review</div>
    );
  }
});

var ViewReview= React.createClass({
  render: function() {
    return (
      <div>ViewReview</div>
    );
  }
});

ReactDOM.render((
  <Router>
    <Route path="/" component={App}>
      <IndexRoute component={Search}/>
      <Route path="addreview" component={AddReview}/>
      <Route path="view/:reviewId" component={ViewReview}/>
    </Route>
  </Router>
  ),
  document.getElementById('root')
);
