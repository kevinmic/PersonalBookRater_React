import React from 'react';
import { Link } from 'react-router';
var PropTypes = React.PropTypes;
import BookReview2 from './BookReview';


      // <ol>
      //   <li>Title</li>
      //   <li>Author</li>
      //   <li>Series</li>
      //   <li>Overall Rating</li>
      // </ol>

var Search = React.createClass({
  propTypes: {
    data: React.PropTypes.object.isRequired
  },
  render: function() {
    var {data} = this.props;
    var books = Object.keys(data).map((key) => {
      var book = data[key];
      return <div key={key}><BookReview2 key={key} book={book}/><hr/></div>
    })
    return (
      <div>
        {books}
      </div>
    );
  }
});

module.exports = Search;
